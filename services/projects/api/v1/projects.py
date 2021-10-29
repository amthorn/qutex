import requests
from flask import request
from setup_api import v1
from documents.projects import ProjectDocument
from flask_restx import Resource
from marshmallow import Schema, fields
from typing import Any


class ProjectSchema(Schema):
    name = fields.Str(
        required=True,
        # validate=validate.Length(min=3, error="Project name must be at least 3 letters long"),
        error_messages={
            'required': 'The project name is required!',
        }
    )


@v1.route('/<int:projectId>')
class ProjectApi(Resource):
    def get(self, projectId: int) -> dict[str, list]:
        return {'data': [ProjectDocument.objects.get_or_404(id=projectId).to_mongo()]}


@v1.route('/')
class ProjectsApi(Resource):
    def get(self) -> dict[str, list]:
        # Only get projects that user is an admin on
        # TODO: this should be updated later to potentially all projects where the user has
        # "read" access (E.G. been in the queue or is an admin) --> alternative
        # definition: in a room that is registered to the project but is not an admin.
        # TODO: clean this up
        result = requests.get('http://users:4000/api/v1/users/me', cookies=request.cookies)
        result.raise_for_status()
        usersId = result.json()['data'][0]['id']
        data = [
            i.to_mongo() for i in ProjectDocument.objects(
                __raw__={'admins.id': {'$eq': usersId}}
            ).paginate(
                page=request.args.get('page', 1),
                per_page=request.args.get('limit', 50)
            ).items
        ]
        return {'data': data, 'total': len(data)}

    def post(self, **kwargs: dict[str, Any]) -> dict[str, Any]:
        data = ProjectSchema().load(request.json)
        data = ProjectDocument(**data)
        data.save()
        return {
            'data': [data.to_mongo()],
            'message': {'text': 'Posted Successfully!!', 'priority': 'success'}
        }
