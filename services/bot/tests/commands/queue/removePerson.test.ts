/**
 * @file Test file for the "remove person" command.
 * @author Ava Thorn
 */

import { RemovePerson } from '../../../src/commands/queue/removePerson';
import { AddPerson } from '../../../src/commands/queue/addPerson';
import { PROJECT_MODEL } from '../../../src/models/project';
import { PERSON_MODEL } from '../../../src/models/person';
import MockDate from 'mockdate';
import * as settings from '../../../src/settings.json';
import { CREATE_PROJECT, TEST_INITIATIVE, TEST_PROJECT, STANDARD_USER, PROJECT_ADMIN, SUPER_ADMIN, STRICT_DATE, CREATE_QUEUE } from '../../util';

const FIVE_SECONDS = 5000;
const USER_ID = 'fooId';
const USER_DISPLAY_NAME = 'foo name';
TEST_INITIATIVE.rawCommand = `add person ${USER_DISPLAY_NAME}`;
TEST_INITIATIVE.mentions = [USER_ID];
TEST_INITIATIVE.action = new RemovePerson();
describe('Removing a person from a queue errors when it should', () => {
    test('errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new RemovePerson().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });

    test('errors when no projects are configured and super admin is invoker', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new RemovePerson().relax({ ...TEST_INITIATIVE, user: SUPER_ADMIN })).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('errors when standard user tries to execute', async () => {
        await CREATE_PROJECT();
        expect(await new RemovePerson().relax({ ...TEST_INITIATIVE, user: STANDARD_USER })).toEqual(
            'You are not authorized to perform that action. Please ask an administrator.'
        );
        expect(await PERSON_MODEL.find({ id: USER_ID }).exec()).toHaveLength(0);
    });
    test('errors when there are no mentions', async () => {
        await CREATE_PROJECT();
        expect(await new RemovePerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN, mentions: [] })).toEqual(
            'You must tag someone to remove from the queue'
        );
        expect(await PERSON_MODEL.find({ id: USER_ID }).exec()).toHaveLength(0);
    });
    test('errors when there are 2 mentions', async () => {
        await CREATE_PROJECT();
        expect(await new RemovePerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN, mentions: ['1', '2'] })).toEqual(
            'You cannot remove more than one person at once'
        );
        expect(await PERSON_MODEL.find({ id: USER_ID }).exec()).toHaveLength(0);
    });
    test('Errors when person doesnt exist', async () => {
        let project = await CREATE_PROJECT();
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(project.admins).toEqual(expect.arrayContaining([expect.objectContaining(TEST_PROJECT.admins[0])]));
        expect(await PERSON_MODEL.find({ id: USER_ID }).exec()).toHaveLength(0);

        expect(await new RemovePerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN })).toEqual(
            `User "${USER_DISPLAY_NAME}" was not found in queue "${settings.DEFAULT_QUEUE_NAME}"`
        );
        // validate
        const people = await PERSON_MODEL.find({ id: USER_ID }).exec();
        expect(people).toHaveLength(0);

        // refresh project object
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        expect(project.queues.filter(i => i.name === project.currentQueue)[0].members).toHaveLength(0);
    });
});

describe('Removing a person from a queue works appropriately', () => {
    beforeAll(() => {
        MockDate.set(STRICT_DATE);
    });
    afterAll(() => {
        MockDate.reset();
    });

    test('removes a person successfully and validates side effects when project exists', async () => {
        let project = await CREATE_PROJECT();
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(project.admins).toEqual(expect.arrayContaining([expect.objectContaining(TEST_PROJECT.admins[0])]));
        expect(await PERSON_MODEL.find({ id: USER_ID }).exec()).toHaveLength(0);

        expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN })).toEqual(
            `Successfully added "${USER_DISPLAY_NAME}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)`
        );
        expect(await new RemovePerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN })).toEqual(
            `Successfully removed "${USER_DISPLAY_NAME}" from queue "DEFAULT".\n\nQueue "DEFAULT" is empty`
        );
        // validate
        const people = await PERSON_MODEL.find({ id: USER_ID }).exec();
        expect(people).toHaveLength(1);
        expect(people[0]).toEqual(expect.objectContaining({
            id: USER_ID,
            displayName: USER_DISPLAY_NAME,
            atHeadCount: 1,
            atHeadSeconds: 0,
            inQueueCount: 1,
            inQueueSeconds: 0
        }));

        // refresh project object
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        expect(project.queues.filter(i => i.name === project.currentQueue)[0].members).toHaveLength(0);
    });
    test('removes a person successfully to non-default queue and validates side effects when project exists', async () => {
        let project = await CREATE_PROJECT();
        await CREATE_QUEUE(project, 'FOO');
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(project.admins).toEqual(expect.arrayContaining([expect.objectContaining(TEST_PROJECT.admins[0])]));
        expect(await PERSON_MODEL.find({ id: USER_ID }).exec()).toHaveLength(0);

        expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN, data: { queue: 'FOO' } })).toEqual(
            `Successfully added "${USER_DISPLAY_NAME}" to queue "FOO".\n\nQueue "FOO":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)`
        );
        expect(await new RemovePerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN, data: { queue: 'FOO' } })).toEqual(
            `Successfully removed "${USER_DISPLAY_NAME}" from queue "FOO".\n\nQueue "FOO" is empty`
        );
        // validate
        const people = await PERSON_MODEL.find({ id: USER_ID }).exec();
        expect(people).toHaveLength(1);
        expect(people[0]).toEqual(expect.objectContaining({
            id: USER_ID,
            displayName: USER_DISPLAY_NAME,
            atHeadCount: 1,
            atHeadSeconds: 0,
            inQueueCount: 1,
            inQueueSeconds: 0
        }));

        // refresh project object
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        expect(project.queues.filter(i => i.name === 'FOO')[0].members).toHaveLength(0);
    });
    describe('Correctly tags someone else when, after removal, they are at the head of the queue and in a group', () => {
        let project: IProject | undefined = undefined;
        const testInitiativeRoom = { ...TEST_INITIATIVE };
        beforeAll(async () => {
            MockDate.set(STRICT_DATE);
            testInitiativeRoom.destination = { roomId: STANDARD_USER.id };
            project = await CREATE_PROJECT({ destination: testInitiativeRoom.destination, registration: true });
            expect(await new AddPerson().relax({ ...testInitiativeRoom, user: PROJECT_ADMIN, mentions: [USER_ID] })).toEqual(
                `Successfully added "${USER_DISPLAY_NAME}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)`
            );
            expect(await new AddPerson().relax({ ...testInitiativeRoom, user: PROJECT_ADMIN, mentions: [USER_ID] })).toEqual(
                `Successfully added "${USER_DISPLAY_NAME}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)\n2. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)`
            );

            project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
            const newQueue = project.queues.filter(i => i.name === project?.currentQueue)[0];
            expect(newQueue.members).toHaveLength(2);
            expect(newQueue.members[0]).toEqual(expect.objectContaining({
                atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
                enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
            }));
            expect(newQueue.members[0].person).toEqual(expect.objectContaining({ id: USER_ID, displayName: USER_DISPLAY_NAME }));
            expect(newQueue.members[1]).toEqual(expect.objectContaining({
                atHeadTime: null,  // Not at the queue's head
                enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
            }));
            expect(newQueue.members[1].person).toEqual(expect.objectContaining({
                id: USER_ID,
                displayName: USER_DISPLAY_NAME
            }));
        });
        afterAll(() => {
            MockDate.reset();
        });
        test('validate', async () => {
            MockDate.set(STRICT_DATE + FIVE_SECONDS);
            expect(await new RemovePerson().relax({
                ...testInitiativeRoom,
                user: PROJECT_ADMIN,
                mentions: [STANDARD_USER.id]
            })).toEqual(`Successfully removed "${USER_DISPLAY_NAME}" from queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)\n\n<@personId:${USER_ID}|${USER_DISPLAY_NAME}>, you're at the front of the queue!`);
        });
    });
    describe('Correctly tags someone else when, after removal, they are at the head of the queue and in a DM', () => {
        let project: IProject | undefined = undefined;
        beforeAll(async () => {
            MockDate.set(STRICT_DATE);
            project = await CREATE_PROJECT({ destination: TEST_INITIATIVE.destination, registration: true });
            expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN, mentions: [USER_ID] })).toEqual(
                `Successfully added "${USER_DISPLAY_NAME}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)`
            );
            expect(await new AddPerson().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN, mentions: [USER_ID] })).toEqual(
                `Successfully added "${USER_DISPLAY_NAME}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)\n2. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)`
            );

            project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
            const newQueue = project.queues.filter(i => i.name === project?.currentQueue)[0];
            expect(newQueue.members).toHaveLength(2);
            expect(newQueue.members[0]).toEqual(expect.objectContaining({
                atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
                enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
            }));
            expect(newQueue.members[0].person).toEqual(expect.objectContaining({ id: USER_ID, displayName: USER_DISPLAY_NAME }));
            expect(newQueue.members[1]).toEqual(expect.objectContaining({
                atHeadTime: null,  // Not at the queue's head
                enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
            }));
            expect(newQueue.members[1].person).toEqual(expect.objectContaining({
                id: USER_ID,
                displayName: USER_DISPLAY_NAME
            }));
        });
        afterAll(() => {
            MockDate.reset();
        });
        test('validate', async () => {
            MockDate.set(STRICT_DATE + FIVE_SECONDS);
            expect(await new RemovePerson().relax({
                ...TEST_INITIATIVE,
                user: PROJECT_ADMIN,
                mentions: [STANDARD_USER.id]
            })).toEqual(`Successfully removed "${USER_DISPLAY_NAME}" from queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${USER_DISPLAY_NAME} (May 6, 2021 01:43:08 AM EST)\n\n${USER_DISPLAY_NAME}, you're at the front of the queue!`);
        });
    });
});