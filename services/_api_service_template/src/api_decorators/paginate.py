import json

from . import APIDecorator
from flask import request, Response
from app import app
from urllib.parse import urlencode
from werkzeug.exceptions import BadRequest


class Paginate(APIDecorator):
    PAGE_KEY = 'limit'
    START_KEY = 'start'

    def get_query_args(self) -> None:
        self.limit = request.args.get(self.PAGE_KEY, app.config['DEFAULT_PAGE_LENGTH'])
        self.start = request.args.get(self.START_KEY, 1)

        # TODO: USE MARSHMALLOW FOR THIS
        try:
            self.limit = int(self.limit)
            assert self.limit > 0
        except (ValueError, AssertionError):
            raise BadRequest("Query argument 'limit' must be a non-zero integer")

        try:
            self.start = int(self.start)
            assert self.start > 0
        except (ValueError, AssertionError):
            raise BadRequest("Query argument 'start' must be a non-zero integer")

    def _get_url_with_params(self, params: dict[str, int]) -> str:
        if not params:
            return ''
        else:
            urlparams = ("?" + urlencode(params)) if params else ""
            return f'{app.config["FQDN"]}{request.path}{urlparams}'

    def calculate_total(self) -> None:
        # Calculate totals for pagination
        # API design means return value should always be a list
        self.total = len(self.data)

    def calculate_previous_page(self) -> None:
        # if start = 1, we are on the first page, thus there is no previous page
        if self.start == 1:
            self.previous_data = {}
        else:
            # Calculate the previous page.
            # Which is equal to the current start value minus the page size
            self.previous_data = {
                'start': max(1, self.start - self.limit),
                'limit': self.limit
            }
        self.previous = self._get_url_with_params(self.previous_data)

    def calculate_next_page(self) -> None:
        # if start + limit is greater than the total records, there is no next page.
        if self.start + self.limit > self.total:
            self.next_data = {}
        else:
            # Calculate the next page. Which is equal to the current start value plus the page size
            self.next_data = {
                'start': self.start + self.limit,
                'limit': self.limit
            }
        self.next = self._get_url_with_params(self.next_data)

    def operation(self) -> Response:
        if not isinstance(self.data, (tuple, list)):
            return self.response

        self.calculate_total()

        self.calculate_previous_page()
        self.calculate_next_page()

        # Using bounds, calculate pagination
        self.response.data = json.dumps({
            **{k: v for k, v in self.response.json.items() if k != 'data'},
            'start': self.start,
            'limit': self.limit,
            'next': self.next,
            'previous': self.previous,
            'total': self.total,
            'data': self.data[(self.start - 1):(self.start - 1 + self.limit)]
        })
        return self.response
