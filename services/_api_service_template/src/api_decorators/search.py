import json

from . import APIDecorator
from flask import request, Response


class Search(APIDecorator):
    QUERY_KEY = 'query'

    def get_query_args(self) -> None:
        self.query = request.args.get(self.QUERY_KEY, '')

    def operation(self) -> Response:
        if not isinstance(self.data, (tuple, list)):
            return self.response

        matches = []
        for i in self.data:
            if isinstance(i, dict):
                for k, v in i.items():
                    if self.query.lower() in str(v).lower():
                        matches.append(i)
                        break
        self.response.data = json.dumps({
            **{k: v for k, v in self.response.json.items() if k != 'data'},
            'data': matches
        })
        return self.response
