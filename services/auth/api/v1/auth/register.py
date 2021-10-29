import webexteamssdk

from app import app
from setup_api import v1

from blacklist_handler import BlacklistHandler
from encoder import JWTEncoder
from flask import request
from flask_restx import Resource
from marshmallow import Schema, fields
from documents.person import PersonDocument
from werkzeug.exceptions import BadRequest, Unauthorized, Conflict
from typing import Union


class RegisterSchema(Schema):
    password = fields.Str(required=True)
    code = fields.Str(required=True)


@v1.route('/register')
class AuthRegisterApi(Resource):
    def post(self) -> dict[str, Union[list[dict], dict[str, str]]]:
        # Check if the token is valid and not expired
        # Also consume the token as user will have sent a password in as well
        # And now we will set the password which can be used for
        # further authentication in the future.
        # No need for temporary token anymore.
        data = RegisterSchema().load(request.json)

        # Will raise an error if not authzed
        temp_token = JWTEncoder().decode(data['code'])
        if 'email' not in temp_token:
            # Should never occur unless something weird is going on
            # where they are using a permanant JWT
            # as a temporary code or somehow have access to the secret key.
            raise Unauthorized("Token form is invalid.")

        bot = webexteamssdk.WebexTeamsAPI(app.config['WEBEX_TEAMS_ACCESS_TOKEN'])

        possible_users = [i for i in bot.people.list(email=temp_token['email'])]

        if len(possible_users) > 1:
            raise Conflict(
                "More than one webex account found for that email address. Cannot resolve conflict."
            )
        elif len(possible_users) == 0:
            # This shouldn't happen because how would a temporary code be sent otherwise?
            # Perhaps if they delete their account in the intermediary time.
            raise BadRequest("No Webex users were found with that email address")

        user_data = possible_users[0]

        # Authenticated, attempt to set password before blacklisting temporary token
        # The basic PersonDocument.objects.get(id=user_data.id) does not work.
        # Perhaps a bug in mongo engine
        user = PersonDocument.objects(__raw__={'id': user_data.id})
        user.update_one(
            set__displayName=user_data.displayName,
            set__email=temp_token['email'],
            set__passwordHash=PersonDocument._hash(data['password']),
            upsert=True
        )

        user = PersonDocument.objects.get(__raw__={'id': user_data.id})

        # Invalidate the temporary code (Do this before the message is deleted)
        BlacklistHandler().add(request.json.get('code', ''), expiration=temp_token['exp'])

        # Delete webex message with temporary code
        bot.messages.delete(messageId=temp_token['messageId'])

        # User is registered, they will now use their password to login.
        return {
            'data': [user.to_mongo()],
            'message': {
                'text': f'Verified user "{user.email}" Successfully!!',
                'priority': 'success'
            }
        }
