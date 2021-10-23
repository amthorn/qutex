from app import app
from setup_db import BaseMixin


class ProjectDocument(BaseMixin, app.db.Document):
    # Strict must be false otherwise we get this error:
    # The fields "{'__v'}" do not exist on the document
    meta = {'collection': 'projects', 'strict': False}

    ##########
    # FIELDS #
    ##########

    name = app.db.StringField(required=True)
    # TODO: Verify types
    currentQueue = app.db.StringField(required=True)
    queues = app.db.StringField(required=True)
    admins = app.db.StringField(required=True)
