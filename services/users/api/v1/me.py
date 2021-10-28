from app import app
from flask import request
from flask_restx import Resource
import requests
import json
from setup_api import v1
from webexteamssdk import WebexTeamsAPI


@v1.route('/me')
class MeApi(Resource):
    def get(self) -> dict[str, list]:
        result = requests.get('http://auth:4000/api/v1/auth/token/check', cookies=request.cookies)
        bot = WebexTeamsAPI(app.config['WEBEX_TEAMS_ACCESS_TOKEN'])
        return {'data': [json.loads(bot.people.get(result.json()['_token']['userId']).to_json())]}
