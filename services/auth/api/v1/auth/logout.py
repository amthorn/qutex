from app import app
from setup_api import v1

from blacklist_handler import BlacklistHandler
from encoder import JWTEncoder
from flask import request
from flask_restx import Resource
from typing import Union


@v1.route('/logout')
class LogoutApi(Resource):
    def post(self) -> dict[str, Union[bool, dict[str, str]]]:
        token = request.cookies.get(app.config.get('TOKEN_COOKIE_NAME'))
        BlacklistHandler().add(
            token, expiration=JWTEncoder().decode(token)['exp'])
        return {
            'data': {'success': True},
            'message': {
                'text': 'Logged out successfully.',
                'priority': 'success'
            }
        }
