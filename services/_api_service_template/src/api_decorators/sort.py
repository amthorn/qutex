import json

from . import APIDecorator
from flask import request, Response
from werkzeug.exceptions import BadRequest

# Pagination does not exist in the pynamodb
# Flask-rest-paginate and flask-paginate also do not handle this scenario
# Flask-rest-paginate requires SQLAlchemy
# And flask-paginate is very tightly coupled with bootstrap and UI rendering


class Sort(APIDecorator):
    ORDER_KEY = 'order_by'
    DIRECTION_KEY = 'direction'
    DIRECTIONS = {
        'ASC': 1,
        'DESC': -1
    }

    def get_query_args(self) -> None:
        self.order_by = request.args.get(self.ORDER_KEY, '').lower()
        self.direction = request.args.get(self.DIRECTION_KEY, '').upper()

        # TODO: USE MARSHMALLOW
        if self.direction and self.direction not in self.DIRECTIONS:
            string_directions = ', '.join(self.DIRECTIONS)
            raise BadRequest(f"Query argument 'direction' must be one of: {string_directions}")

    def operation(self) -> Response:
        if not isinstance(self.data, (tuple, list)):
            return self.response

        if self.order_by:
            self.data = sorted(self.data, key=lambda x: x[self.order_by])

        if self.direction:
            self.data = self.data[::(self.DIRECTIONS[self.direction])]

        # Using bounds, calculate pagination
        self.response.data = json.dumps({
            **{k: v for k, v in self.response.json.items() if k != 'data'},
            **({'order_by': self.order_by} if self.order_by else {}),
            **({'direction': self.direction} if self.direction else {}),
            'data': self.data
        })
        return self.response
