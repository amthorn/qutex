/**
 * @file Contains various utility functions and constants for use by the jest tests.
 * @author Ava Thorn
 */
import { REGISTRATION_MODEL } from '../src/models/registration';
import { ProjectDocument, PROJECT_MODEL } from '../src/models/project';
import * as settings from '../src/settings.json';

export const STRICT_DATE = 1620279788056;
export const PROJECT_NAME = 'PNAME';
export const PROJECT_ADMIN = { id: 'adminId', displayName: 'ANAME' };
export const STANDARD_USER = { id: 'standardId', displayName: 'STANDARDNAME' };
export const SUPER_ADMIN = { id: 'superAdminId', displayName: 'SUPERANAME' };
export const TEST_QUEUE: IQueue = { name: settings.DEFAULT_QUEUE_NAME, members: [], history: [] };
export const TEST_REGISTRATION: IRegistration = { destination: { toPersonId: 'notReal' }, projectName: PROJECT_NAME };
export const TEST_PROJECT: IProject = {
    name: PROJECT_NAME,
    queues: [TEST_QUEUE],
    admins: [PROJECT_ADMIN],
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
export const TEST_INITIATIVE: IInitiative = {
    data: {},
    rawCommand: '',
    destination: { toPersonId: 'notReal' },
    action: null,
    debug: false,
    user: STANDARD_USER,
    mentions: [],
    similarity: { similarity: 0.3, action: {} }
};
export const TEST_QUEUE_MEMBER: IQueueMember = { person: TEST_OTHER_USER, enqueuedAt: new Date('2020-01-01'), atHeadTime: null };
/**
 * Creates a target project with various parameters for use in testing.
 *
 * @param obj - The destructured object project parameters.
 * @param obj.name - The name of the project to create.
 * @param obj.destination - The destination for which to create the project.
 * @param obj.registration - Whether or not to register the project to the destination upon creation.
 * @param obj.admins - A list of IProjectAdmin interfaces to use as the initial list of project admins.
 * @returns The newly created project.
 */
export const CREATE_PROJECT = async (
    {
        name = PROJECT_NAME,
        destination,
        registration = true,
        admins = TEST_PROJECT.admins
    }: {
        name?: string;
        destination?: Destination;
        registration?: boolean;
        admins?: IProjectAdmin[];
    } = {}): Promise<ProjectDocument> => {
    // Create project
    expect(await PROJECT_MODEL.find({ name: name }).exec()).toHaveLength(0);
    const project = await PROJECT_MODEL.build({ ...TEST_PROJECT, name: name, admins: admins }).save();
    expect(await PROJECT_MODEL.find({ name: name }).exec()).toHaveLength(1);

    // Set registration for project
    if (registration) {
        expect(await REGISTRATION_MODEL.find({ projectName: name }).exec()).toHaveLength(0);
        TEST_REGISTRATION.projectName = name;
        TEST_REGISTRATION.destination = destination ?? TEST_REGISTRATION.destination;
        await REGISTRATION_MODEL.build(TEST_REGISTRATION).save();
        expect(await REGISTRATION_MODEL.find({ projectName: name }).exec()).toHaveLength(1);
    }

    return project;
};
/**
 * Creates a new target queue by name on a target project with a set of members.
 *
 * @param project - Project on which to create a new queue.
 * @param queueName - The name of the queue to create.
 * @param members - Initiative member set for the queue.
 * @returns The newly created queue object.
 */
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