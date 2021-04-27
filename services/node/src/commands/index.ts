import { Get as GetStatus } from './status/get';
import { Create as CreateProject } from './projects/create';
import { List as ListProjects } from './projects/list';
import { Delete as DeleteProject } from './projects/delete';

export default [
    new GetStatus(),
    new CreateProject(),
    new ListProjects(),
    new DeleteProject()
] as Command[];