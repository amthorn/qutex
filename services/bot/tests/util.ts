import { REGISTRATION_MODEL } from '../src/models/registration';
import { ProjectDocument, PROJECT_MODEL } from '../src/models/project';
import * as settings from '../src/settings.json';

export const PROJECT_NAME = 'PNAME';
export const TEST_QUEUE: IQueue = { name: settings.DEFAULT_QUEUE_NAME, members: [] };
export const TEST_REGISTRATION: IRegistration = { destination: { toPersonId: 'notReal' }, projectName: PROJECT_NAME };
export const TEST_PROJECT: IProject = {
    name: PROJECT_NAME,
    queues: [TEST_QUEUE],
    admins: [{ id: 'adminId', displayName: 'ANAME' }],
    currentQueue: settings.DEFAULT_QUEUE_NAME
};
export const TEST_OTHER_USER: IPerson = {
    id: 'otherUser',
    displayName: 'other user name',
    atHeadCount: 0,
    atHeadSeconds: 0,
    inQueueSeconds: 0,
    inQueueCount: 0
};
export const TEST_QUEUE_MEMBER: IQueueMember = { person: TEST_OTHER_USER, enqueuedAt: new Date('2020-01-01'), atHeadTime: null };

export const CREATE_PROJECT = async (destination?: Destination): Promise<ProjectDocument> => {
    // Create project
    expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    const project = await PROJECT_MODEL.build(TEST_PROJECT).save();
    expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);

    // Set registration for project
    expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(0);
    if (destination) {
        TEST_REGISTRATION.destination = destination;
    }
    await REGISTRATION_MODEL.build(TEST_REGISTRATION).save();
    expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(1);

    return project;
};
export const CREATE_QUEUE = async (project: ProjectDocument, queueName?: string, members?: IQueueMember[]): Promise<IQueue> => {
    const preLength = project.queues.length;
    const queue = { ...TEST_QUEUE, name: queueName ? queueName : TEST_QUEUE.name, members: members?.length ? members : [] };
    expect(project.queues.map(i => i.name)).not.toContain(queue.name);
    project.queues.push(queue);
    await project.save();
    expect(project.queues).toHaveLength(preLength + 1);
    expect(project.queues.slice(-1)[0].name).toEqual(queue.name);
    return queue;
};