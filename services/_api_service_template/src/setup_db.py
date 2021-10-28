from app import app
from flask_mongoengine import MongoEngine

app.config['MONGODB_SETTINGS'] = {
    'host': f'mongodb://root:{app.config["MONGO_PASSWORD"]}@mongo:27017/qutex?authSource=admin'
}

db = MongoEngine(app)
app.db = db


class TimestampMixin():
    created_at = db.DateTimeField(auto_now_add=True, auto_now=False)
    updated_at = db.DateTimeField(auto_now_add=False, auto_now=True)
    deleted_at = db.DateTimeField(required=False)


class BaseMixin(TimestampMixin):
    id = db.StringField(primary_key=True)
