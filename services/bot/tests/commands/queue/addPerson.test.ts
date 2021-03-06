/**
 * @file Test file for the "add person" command.
 * @author Ava Thorn
 */

import { AddPerson } from '../../../src/commands/queue/addPerson';
import { PROJECT_MODEL } from '../../../src/models/project';
import { PERSON_MODEL } from '../../../src/models/person';
import MockDate from 'mockdate';
import { CREATE_PROJECT, TEST_INITIATIVE, TEST_PROJECT, STANDARD_USER, PROJECT_ADMIN, SUPER_ADMIN, STRICT_DATE, CREATE_QUEUE } from '../../util';

const USER_ID = 'fooId';
const USER_DISPLAY_NAME = 'foo name';
TEST_INITIATIVE.rawCommand = `add person ${USER_DISPLAY_NAME}`;
TEST_INITIATIVE.mentions = [USER_ID];
TEST_INITIATIVE.action = new AddPerson();
describe('Adding a person to a queue errors when it should', () => {
    test('errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new AddPerson().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('errors when no projects are configured and super admin is invoker', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: SUPER_ADMIN })).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('errors when standard user tries to execute', async () => {
        await CREATE_PROJECT();
        expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: STANDARD_USER })).toEqual(
            'You are not authorized to perform that action. Please ask an administrator.'
        );
        expect(await PERSON_MODEL.find({ id: USER_ID }).exec()).toHaveLength(0);
    });
    test('errors when there are no mentions', async () => {
        await CREATE_PROJECT();
        expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN, mentions: [] })).toEqual(
            'You must tag someone to add to the queue'
        );
        expect(await PERSON_MODEL.find({ id: USER_ID }).exec()).toHaveLength(0);
    });
    test('errors when there are 2 mentions', async () => {
        await CREATE_PROJECT();
        expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN, mentions: ['1', '2'] })).toEqual(
            'You cannot add more than one person at once'
        );
        expect(await PERSON_MODEL.find({ id: USER_ID }).exec()).toHaveLength(0);
    });
    test('errors when non-default queue is specified that does not exist', async () => {
        const project = await CREATE_PROJECT();
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(await new AddPerson().relax({
            ...TEST_INITIATIVE,
            data: { queue: 'FOO' },
            user: PROJECT_ADMIN,
            mentions: ['1']
        })).toEqual('A queue with name "FOO" does not exist.');
        expect(queue.members).toHaveLength(0);
        expect(await PERSON_MODEL.find({ id: STANDARD_USER.id }).exec()).toHaveLength(0);
    });
});

describe('Adding a person to a queue works appropriately', () => {
    beforeAll(() => {
        MockDate.set(STRICT_DATE);
    });
    afterAll(() => {
        MockDate.reset();
    });

    test('adds a person successfully and validates side effects when project exists', async () => {
        let project = await CREATE_PROJECT();
        let queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(project.admins).toEqual(expect.arrayContaining([expect.objectContaining(TEST_PROJECT.admins[0])]));
        expect(await PERSON_MODEL.find({ id: USER_ID }).exec()).toHaveLength(0);

        expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN })).toEqual(
            `Successfully added "${USER_DISPLAY_NAME}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)`
        );
        // validate
        const people = await PERSON_MODEL.find({ id: USER_ID }).exec();
        expect(people).toHaveLength(1);
        expect(people[0]).toEqual(expect.objectContaining({
            id: USER_ID,
            displayName: USER_DISPLAY_NAME,
            atHeadCount: 0,
            atHeadSeconds: 0,
            inQueueCount: 0,
            inQueueSeconds: 0
        }));

        // refresh project object
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(1);
        expect(queue.members[0]).toEqual(expect.objectContaining({
            atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
            enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
        }));
        expect(queue.members[0].person).toEqual(expect.objectContaining({ id: USER_ID, displayName: USER_DISPLAY_NAME }));
    });
    test('adds me successfully to non-default queue and validates side effects when project exists', async () => {
        let project = await CREATE_PROJECT();
        let queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(project.admins).toEqual(expect.arrayContaining([expect.objectContaining(TEST_PROJECT.admins[0])]));
        expect(await PERSON_MODEL.find({ id: TEST_INITIATIVE.user.id }).exec()).toHaveLength(0);
        await CREATE_QUEUE(project, 'FOO');

        expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN })).toEqual(
            `Successfully added "${USER_DISPLAY_NAME}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)`
        );
        expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN, data: { queue: 'FOO' } })).toEqual(
            `Successfully added "${USER_DISPLAY_NAME}" to queue "FOO".\n\nQueue "FOO":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)`
        );

        // refresh project object
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(1);
        expect(queue.members[0]).toEqual(expect.objectContaining({
            atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
            enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
        }));
        expect(queue.members[0].person).toEqual(expect.objectContaining({ id: USER_ID, displayName: USER_DISPLAY_NAME }));
        queue = project.queues.filter(i => i.name === 'FOO')[0];
        expect(queue.members).toHaveLength(1);
        expect(queue.members[0]).toEqual(expect.objectContaining({
            atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
            enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
        }));
        expect(queue.members[0].person).toEqual(expect.objectContaining({ id: USER_ID, displayName: USER_DISPLAY_NAME }));
    });
    test('Can add person when they already exist', async () => {
        let project = await CREATE_PROJECT();
        let queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(project.admins).toEqual(expect.arrayContaining([expect.objectContaining(TEST_PROJECT.admins[0])]));
        expect(await PERSON_MODEL.find({ id: USER_ID }).exec()).toHaveLength(0);

        expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN })).toEqual(
            `Successfully added "${USER_DISPLAY_NAME}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)`
        );
        expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN })).toEqual(
            `Successfully added "${USER_DISPLAY_NAME}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)\n2. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)`
        );
        // validate
        const people = await PERSON_MODEL.find({ id: USER_ID }).exec();
        expect(people).toHaveLength(1);
        expect(people[0]).toEqual(expect.objectContaining({
            id: USER_ID,
            displayName: USER_DISPLAY_NAME,
            atHeadCount: 0,
            atHeadSeconds: 0,
            inQueueCount: 0,
            inQueueSeconds: 0
        }));

        // refresh project object
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(2);
        expect(queue.members[0]).toEqual(expect.objectContaining({
            atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
            enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
        }));
        expect(queue.members[0].person).toEqual(expect.objectContaining({ id: USER_ID, displayName: USER_DISPLAY_NAME }));

        expect(queue.members[1]).toEqual(expect.objectContaining({
            atHeadTime: null,
            enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
        }));
        expect(queue.members[1].person).toEqual(expect.objectContaining({ id: USER_ID, displayName: USER_DISPLAY_NAME }));

    });
});