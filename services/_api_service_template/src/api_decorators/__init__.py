import functools
from typing import Callable, Any
from flask import Response


class APIDecorator:
    def __init__(self, f: Callable[..., Any]) -> None:
        functools.update_wrapper(self, f)
        self.f = f

    def get_query_args(self) -> None:
        pass

    def operation(self) -> Response:
        pass

    def __call__(self, *args: list[Any], **kwargs: dict[Any, Any]) -> Response:
        self.get_query_args()
        # Call function
        self.response = self.f(*args, **kwargs)

        # If the endpoint successfully returned and the data is json, save it.
        if 200 <= self.response.status_code < 300 and self.response.is_json:
            self.data = self.response.json['data']
        else:
            # Abort if non-200 code occurs
            return self.response

        return self.operation() or self.response
