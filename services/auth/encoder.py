import datetime

import jwt
from werkzeug.exceptions import Unauthorized, BadRequest

from app import app
from blacklist_handler import BlacklistHandler


class JWTEncoder(jwt.api_jwt.PyJWT):
    # 1 day if active
    def __init__(self, *args: list, expiration: dict[str, int] = None, **kwargs: dict) -> None:
        self._expiration = expiration or {'days': 1, 'seconds': 0}
        super().__init__(*args, **kwargs)

    def encode(self, **token: dict) -> str:
        now = datetime.datetime.utcnow()
        expr = now + datetime.timedelta(**self._expiration)
        token = super().encode({
            'exp': int(expr.timestamp()),
            'iat': int(now.timestamp()),
            **token
        }, app.secret_key)
        return token

    def decode(self, authToken: str) -> str:
        try:
            token = super().decode(authToken, app.secret_key, algorithms=['HS256'])

            if BlacklistHandler().exists(authToken):
                raise jwt.InvalidTokenError

            return token
        except jwt.ExpiredSignatureError:
            raise Unauthorized('Signature expired. Please log in again.')
        except jwt.InvalidTokenError:
            raise Unauthorized('Invalid token. Please log in again.')
        except jwt.exceptions.DecodeError:
            # Happens when token is basically jibberish
            raise BadRequest('Invalid token. Please log in again.')
        except Exception:
            # Catch all
            raise BadRequest('Token decode error. Please try again')
