import flask
import os
import json
import marshmallow
import pprint
import requests
import werkzeug
import traceback
from app import app
from typing import Union
from bson.objectid import ObjectId

app.config['SERVICE_PREFIX'] = os.environ.get('SERVICE_PREFIX')
app.config['AUTH_SERVICE_TOKEN_CHECK_ROUTE'] = os.environ['AUTH_SERVICE_TOKEN_CHECK_ROUTE']
app.config['AUTH_SERVICE_HOST'] = os.environ['AUTH_SERVICE_HOST']
app.config['TOKEN_COOKIE_NAME'] = 'qutexToken'
app.config['FQDN'] = os.environ.get('FQDN', 'http://localhost')
app.config['DEFAULT_PAGE_LENGTH'] = 50

# Otherwise we get an error "Response" has no attribute 'get' from flask restx
app.config['ERROR_INCLUDE_MESSAGE'] = False


class CustomJSONEncoder(flask.json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

app.config["RESTX_JSON"] = {"cls": CustomJSONEncoder}

########################
# SERVICE CONFIG SETUP #
########################
try:
    with open('/run/secrets/privateKey') as f:
        app.secret_key = f.read()
except Exception as e:
    print("WARNING: No privateKey secret provided for Flask application")

try:
    with open('/run/secrets/token') as f:
        app.config['WEBEX_TEAMS_ACCESS_TOKEN'] = f.read().strip()
except Exception as e:
    print("WARNING: No webex teams access token provided for Flask application")

try:
    with open('/run/secrets/mongoPassword') as f:
        app.config['MONGO_PASSWORD'] = f.read()
except Exception as e:
    print("WARNING:  No mongo password provided for Flask application")

##########
# MODELS #
##########
import setup_db

##########
#  APIS  #
##########
from setup_api import v1  # noqa


import documents
import api


@v1.errorhandler(Exception)
@app.errorhandler(Exception)
def handle_exception(e: Exception) -> flask.Response:
    # Flask rest x bugs cause this to catch all errors
    if isinstance(e, marshmallow.exceptions.ValidationError):
        return dump_data(e, flask.make_response(), e.messages, 422)
    elif isinstance(e, werkzeug.exceptions.Unauthorized):
        response = dump_data(e, e.get_response(), {e.name: e.description}, e.code)
        return response[0], response[1], {**response[2], 'Set-Cookie': f'{app.config.get("TOKEN_COOKIE_NAME")}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'}
    elif isinstance(e, werkzeug.exceptions.HTTPException):
        return dump_data(e, e.get_response(), {e.name: e.description}, e.code)
    return dump_data(e, flask.make_response(), {str(e.__class__.__name__): str(e)}, 500)


@app.before_request
def authenticate():
    # if its not an unauthenticated route
    if not flask.request.path.startswith('/api/v1/auth/') and not flask.request.path.endswith('/healthcheck'):
        # Will throw 401 if not authenticated
        result = requests.get(
            f"{app.config['AUTH_SERVICE_HOST']}/api/v1/auth/token/check",
            cookies=flask.request.cookies
        )
        # It's not a very nice error, make it nicer looking
        if result.status_code == 401:
            raise werkzeug.exceptions.Unauthorized(result.json()['data']['description'])

        result.raise_for_status()


def dump_data(
    e: Exception,
    response: flask.Response,
    data: Union[list, dict],
    code: int
) -> flask.Response:
    message = dump_messages(data)

    data = {
        "data": {
            "name": e.name if hasattr(e, 'name') else str(e.__class__.__name__),
            "description": e.description if hasattr(e, 'description') else '',
        },
        "message": {
            "raw": data,
            "text": message,
            "priority": "error"
        }
    }
    app.logger.debug(pprint.pformat(response.data))
    app.logger.debug(traceback.format_exc())
    app.logger.debug(app.url_map)
    return data, code, {'Content-Type': 'application/json'}


def dump_messages(data: dict) -> str:
    messages = []
    for k, v in data.items():
        if isinstance(v, (tuple, list)) and len(v) > 0:
            messages += [f'{k}: {i}' for i in v]
        else:
            messages.append(f'{k}: {v}')
    return '\n'.join(messages)
