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

export const CREATE_PROJECT = async (): Promise<ProjectDocument> => {
    // Create project
    expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    const project = await PROJECT_MODEL.build(TEST_PROJECT).save();
    expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);

    // Set registration for project
    expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(0);
    await REGISTRATION_MODEL.build(TEST_REGISTRATION).save();
    expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(1);

    return project;
};
export const CREATE_QUEUE = async (project: ProjectDocument, queueName?: string): Promise<IQueue> => {
    const preLength = project.queues.length;
    const queue = { ...TEST_QUEUE, name: queueName ? queueName : TEST_QUEUE.name };
    expect(project.queues).not.toContain(queue);
    project.queues.push(queue);
    await project.save();
    expect(project.queues).toHaveLength(preLength + 1);
    return queue;
};