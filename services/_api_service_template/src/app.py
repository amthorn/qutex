from flask import Flask

app = Flask(__name__)
# If this is False,d each service does not recognize the root route of /
# app.url_map.strict_slashes = False

import main  # noqa
