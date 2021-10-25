import json

from app import app
from flask_mongoengine import MongoEngine

app.config['MONGODB_SETTINGS'] = {
    'host': f'mongodb://root:{app.config["MONGO_PASSWORD"]}@mongo:27017/qutex?authSource=admin'
}

db = MongoEngine(app)
app.db = db

class SerializerMixin:
    def as_dict(self):
        ugly = json.loads(self.to_json())
        

class TimestampMixin():
    created_at = db.DateTimeField(auto_now_add=True, auto_now=False)
    updated_at = db.DateTimeField(auto_now_add=False, auto_now=True)
    deleted_at = db.DateTimeField(required=False)


class BaseMixin(TimestampMixin, SerializerMixin):
    id = db.StringField(primary_key=True)
