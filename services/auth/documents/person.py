import hashlib
from app import app
from setup_db import BaseMixin


class PersonDocument(BaseMixin, app.db.Document):
    meta = {'collection': 'people', 'strict': False}
    # serialize_rules = ('-passwordHash', '-password')  # '-api_key_hash')

    ##########
    # FIELDS #
    ##########

    passwordHash = app.db.StringField(max_length=512, required=False, select=False)
    email = app.db.StringField(max_length=64, unique=True, sparse=True, required=False)

    # Bot Fields
    displayName = app.db.StringField(required=True)
    atHeadSeconds = app.db.IntField(required=True, default=0)
    atHeadCount = app.db.IntField(required=True, default=0)
    inQueueSeconds = app.db.IntField(required=True, default=0)
    inQueueCount = app.db.IntField(required=True, default=0)

    @staticmethod
    def _hash(value: str) -> str:
        return hashlib.sha3_512(value.encode(), usedforsecurity=True).hexdigest()

    def to_mongo(self, *args: list, **kwargs: dict) -> dict:
        # Don't expose the password hash
        return {k: v for k, v in super().to_mongo(*args, **kwargs).items() if k != 'passwordHash'}

    # @hybrid_property
    # def api_key(self) -> str:
    #     return self.api_key_hash

    # @api_key.setter
    # def api_key(self, plaintext_api_key: str) -> str:
    #     self.api_key_hash = hashlib.sha3_512(
    #         plaintext_api_key.encode(),
    #         usedforsecurity=True
    #     ).hexdigest()
