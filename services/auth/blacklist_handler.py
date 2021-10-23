import redis
import datetime


class BlacklistHandler():
    prefix = "session:"

    def __init__(self) -> None:
        self.host = redis.Redis(host='redis', port=6379, db=0)

    def add(self, authToken: str, expiration: int) -> int:
        return self.host.set(
            name=f'{self.prefix}{authToken}',
            value='',
            # Get seconds until expiration
            # Add five seconds to expiration to ensure blacklisted for the
            # entire length of the token's lifetime
            ex=(expiration - int(datetime.datetime.utcnow().timestamp())) + 5,
            # Only set the value if it does not already exist
            nx=True
        )

    def exists(self, authToken: str) -> bool:
        return self.host.exists(f'{self.prefix}{authToken}') == 1
