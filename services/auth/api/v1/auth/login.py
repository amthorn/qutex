from app import app
from setup_api import v1

from blacklist_handler import BlacklistHandler
from encoder import JWTEncoder
from flask import jsonify, request
from flask_restx import Api, Resource
from marshmallow import Schema, fields
from documents.person import PersonDocument
from werkzeug.exceptions import Unauthorized
from typing import Union


class LoginSchema(Schema):
    # TODO set password requirements
    password = fields.Str(required=True)
    email = fields.Str(required=True)


@v1.route('/login')
class LoginApi(Resource):
    def post(self) -> dict[str, dict[str, str]]:
        data = LoginSchema().load(request.json)
        user = PersonDocument.objects(email=data['email']).first()
        if not user or user.passwordHash != PersonDocument._hash(data['password']):
            raise Unauthorized('Username or password incorrect')
        else:
            token = JWTEncoder().encode(userId=user.id)
            response = jsonify({
                'data': {'token': token},
                'message': {
                    'text': f'Logged in user "{user.email}" Successfully!!',
                    'priority': 'success'
                }
            })
            response.set_cookie(app.config.get('TOKEN_COOKIE_NAME'), token)
            return response
