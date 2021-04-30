import { CommandBase } from './base';

import { Get as GetStatus } from './status/get';

import { Card as HelpCard } from './help/card';

import { Create as CreateProject } from './projects/create';
import { List as ListProjects } from './projects/list';
import { Delete as DeleteProject } from './projects/delete';
import { Card as ProjectCard } from './projects/card';
import { SetCurrentQueue } from './projects/setCurrentQueue';

import { Operation as Register } from './registrations/register';
import { Card as RegistrationCard } from './registrations/card';
import { Get as ShowRegistration } from './registrations/get';

import { List as ListQueues } from './queues/list';
import { Create as CreateQueues } from './queues/create';
import { Card as QueuesCard } from './queues/card';
import { Delete as DeleteQueues } from './queues/delete';
import { Get as GetQueue } from './queues/get';

import { AddMe } from './queue/addMe';
import { RemoveMe } from './queue/removeMe';
import { Card as QueueCard } from './queue/card';

import { Create as CreateAdmin } from './admins/create';
import { List as ListAdmins } from './admins/list';
import { RemoveMe as RemoveMeAsAdmin } from './admins/removeMe';
import { Card as AdminCard } from './admins/card';

export default [
    // Status
    new GetStatus(),

    // Help
    new HelpCard(),

    // Projects
    new CreateProject(),
    new ListProjects(),
    new DeleteProject(),
    new ProjectCard(),
    new SetCurrentQueue(),

    // Admins
    new CreateAdmin(),
    new ListAdmins(),
    new RemoveMeAsAdmin(),
    new AdminCard(),

    // Registration
    new Register(),
    new ShowRegistration(),
    new RegistrationCard(),

    // Queues
    new ListQueues(),
    new CreateQueues(),
    new DeleteQueues(),
    new QueuesCard(),
    new GetQueue(),

    // Queue
    new QueueCard(),
    new AddMe(),
    new RemoveMe()
] as CommandBase[];