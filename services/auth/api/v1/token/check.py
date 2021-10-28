from app import app
from setup_api import v1

from encoder import JWTEncoder
from flask import request
from flask_restx import Resource
from werkzeug.exceptions import Forbidden


@v1.route('/token/check')
class AuthCheckApi(Resource):
    def get(self) -> dict[str, dict[str, bool]]:
        # Will raise an error if not authzed
        token = JWTEncoder().decode(request.cookies.get(app.config.get('TOKEN_COOKIE_NAME')))
        role = request.args.get('role')
        # Only support super admin for now
        # TODO: clean this up and make more parameterizable and better in general
        if role and role == 'superadmin' and token['userId'] not in app.config['SUPER_ADMINS']:
            raise Forbidden

        return {
            'data': {'success': True}, 
            '_token': token
        }
