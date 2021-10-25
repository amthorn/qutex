from flask import request, jsonify
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
        # TODO: authorize
        page_num = request.args.get('page', 1)
        limit = request.args.get('limit', 1)
        # data = [i.to_mongo() for i in ProjectDocument.objects.skip((page_num - 1) * limit).limit(limit)]
        data = [i.to_mongo() for i in ProjectDocument.objects()] * 100
        return {'data': data, 'total': len(data)}

    def post(self, **kwargs: dict[str, Any]) -> dict[str, Any]:
        data = ProjectSchema().load(request.json)
        data = ProjectDocument(**data)
        data.save()
        return {
            'data': [data.to_mongo()],
            'message': {'text': 'Posted Successfully!!', 'priority': 'success'}
        }
