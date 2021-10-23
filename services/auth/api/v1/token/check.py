from app import app
from setup_api import v1

from encoder import JWTEncoder
from flask import request
from flask_restx import Resource


@v1.route('/token/check')
class AuthCheckApi(Resource):
    def get(self) -> dict[str, dict[str, bool]]:
        # Will raise an error if not authzed
        return {'data': {'success': True}, '_token': JWTEncoder().decode(request.cookies.get(app.config.get('TOKEN_COOKIE_NAME')))}

