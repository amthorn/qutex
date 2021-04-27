import { Get as GetStatus } from './status/get';
import { Create as CreateProject } from './projects/create';
import { List as ListProjects } from './projects/list';

export default [
    new GetStatus(),
    new CreateProject(),
    new ListProjects()
] as Command[];