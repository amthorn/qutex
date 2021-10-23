from app import app
from flask_restx import Api, Resource
from api_decorators.search import Search
from api_decorators.sort import Sort
from api_decorators.paginate import Paginate

v1 = Api(
    app,
    version='1.0',
    title=f'Qutex v1 {app.config["SERVICE_PREFIX"]} service API',
    prefix=f'/api/v1/{app.config["SERVICE_PREFIX"]}',
    # Search must come first to eliminate the irrelevant rows
    # Sort must come next so that pagination is accurate for the entire dataset
    # (E.G. page1 contains data before page2)
    # Paginate comes last because it is slicing the total dataset.
    decorators=[Search, Sort, Paginate]
)


@v1.route('/healthcheck')
class HealthcheckApi(Resource):
    def get(self) -> dict[str, dict[str, str]]:
        return {'data': {'status': 'OK'}}
