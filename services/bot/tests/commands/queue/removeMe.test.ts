import { AddMe } from '../../../src/commands/queue/addMe';
import { RemoveMe } from '../../../src/commands/queue/removeMe';
import { PROJECT_MODEL } from '../../../src/models/project';
import { PERSON_MODEL } from '../../../src/models/person';
import MockDate from 'mockdate';
import { CREATE_PROJECT, TEST_QUEUE_MEMBER, TEST_OTHER_USER, TEST_INITIATIVE, STANDARD_USER } from '../../util';

const STRICT_DATE = 1620279788056;
const TWO_SECONDS = 2000;
const FOUR_SECONDS = 4000;
const FIVE_SECONDS = 5000;
const TEN_SECONDS = 10000;

TEST_INITIATIVE.rawCommand = 'remove me';
TEST_INITIATIVE.action = new RemoveMe();

describe('Removing me from a queue works appropriately', () => {
    beforeAll(() => {
        MockDate.set(STRICT_DATE);
    });
    afterAll(() => {
        MockDate.reset();
    });

    test('errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new RemoveMe().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });

    test('errors when no one is in the queue', async () => {
        const project = await CREATE_PROJECT();
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(await new RemoveMe().relax(TEST_INITIATIVE)).toEqual(`User "${STANDARD_USER.displayName}" was not found in queue "DEFAULT"`);
        expect(queue.members).toHaveLength(0);
    });

    test('errors when there is someone in the queue but its not the user', async () => {
        const project = await CREATE_PROJECT();
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        queue.members.push(TEST_QUEUE_MEMBER);
        await project.save();

        const newProject = await PROJECT_MODEL.find({ name: project.name }).exec();
        const newQueue = newProject[0].queues.filter(i => i.name === newProject[0].currentQueue)[0];
        expect(newQueue.members).toHaveLength(1);
        expect(await new RemoveMe().relax(TEST_INITIATIVE)).toEqual(`User "${STANDARD_USER.displayName}" was not found in queue "DEFAULT"`);
        expect(newQueue.members).toHaveLength(1);

    });

    describe('removes me successfully and validates side effects when project exists and user is in the queue', () => {
        let project: IProject | undefined = undefined;
        beforeAll(async () => {
            MockDate.set(STRICT_DATE);
            project = await CREATE_PROJECT();
            expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual(
                `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)`
            );

            project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
            const newQueue = project.queues.filter(i => i.name === project?.currentQueue)[0];
            expect(newQueue.members).toHaveLength(1);
            expect(newQueue.members[0]).toEqual(expect.objectContaining({
                atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
                enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
            }));
            expect(newQueue.members[0].person).toEqual(expect.objectContaining(TEST_INITIATIVE.user));
        });
        afterAll(() => {
            MockDate.reset();
        });
        test('validate', async () => {
            MockDate.set(STRICT_DATE + FIVE_SECONDS);
            expect(await new RemoveMe().relax(TEST_INITIATIVE)).toEqual(`Successfully removed "${STANDARD_USER.displayName}" from queue "DEFAULT".\n\nQueue "DEFAULT" is empty`);

            // Verify
            const person = (await PERSON_MODEL.find({ id: TEST_INITIATIVE.user.id }).exec())[0];
            expect(person).toEqual(expect.objectContaining({
                atHeadCount: 1,
                atHeadSeconds: 5,
                displayName: STANDARD_USER.displayName,
                id: STANDARD_USER.id,
                inQueueCount: 1,
                inQueueSeconds: 5
            }));

            const resultProject = (await PROJECT_MODEL.find({ name: project?.name }).exec())[0];
            const queue = resultProject.queues.filter(i => i.name === resultProject.currentQueue)[0];
            expect(queue.members).toHaveLength(0);
        });
    });

    describe('Only removes front-most instance when user is in the queue twice', () => {
        let project: IProject | undefined = undefined;
        beforeAll(async () => {
            MockDate.set(STRICT_DATE);
            project = await CREATE_PROJECT();
            expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual(
                `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)`
            );
            MockDate.set(STRICT_DATE + TWO_SECONDS);
            expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual(
                `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)\n2. ${STANDARD_USER.displayName} (May 6, 2021 01:43:10 AM EST)`
            );

            project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
            const newQueue = project.queues.filter(i => i.name === project?.currentQueue)[0];
            expect(newQueue.members).toHaveLength(2);
            expect(newQueue.members[0]).toEqual(expect.objectContaining({
                atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
                enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
            }));
            expect(newQueue.members[0].person).toEqual(expect.objectContaining(TEST_INITIATIVE.user));
            expect(newQueue.members[1]).toEqual(expect.objectContaining({
                atHeadTime: null,  // Not at the queue's head
                enqueuedAt: new Date('2021-05-06T05:43:10.056Z')
            }));
            expect(newQueue.members[1].person).toEqual(expect.objectContaining(TEST_INITIATIVE.user));
        });
        afterAll(() => {
            MockDate.reset();
        });
        test('validate', async () => {
            MockDate.set(STRICT_DATE + FIVE_SECONDS);
            expect(await new RemoveMe().relax(TEST_INITIATIVE)).toEqual(`Successfully removed "${STANDARD_USER.displayName}" from queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:10 AM EST)\n\n${STANDARD_USER.displayName}, you're at the front of the queue!`);

            // Verify
            const person = (await PERSON_MODEL.find({ id: TEST_INITIATIVE.user.id }).exec())[0];
            expect(person).toEqual(expect.objectContaining({
                atHeadCount: 1,
                atHeadSeconds: 5,
                displayName: STANDARD_USER.displayName,
                id: STANDARD_USER.id,
                inQueueCount: 1,
                inQueueSeconds: 5
            }));

            const resultProject = (await PROJECT_MODEL.find({ name: project?.name }).exec())[0];
            const queue = resultProject.queues.filter(i => i.name === resultProject.currentQueue)[0];
            expect(queue.members).toHaveLength(1);
            // Should contain the one added later
            expect(queue.members[0]).toEqual(expect.objectContaining({
                // at head time would be the current time (+5 seconds)
                atHeadTime: new Date('2021-05-06T05:43:13.056Z'),

                // Enqueued at (-5 +2 seconds)
                enqueuedAt: new Date('2021-05-06T05:43:10.056Z')
            }));
            expect(queue.members[0].person).toEqual(expect.objectContaining(TEST_INITIATIVE.user));
        });
    });

    describe('Only removes front-most instance when user is in the queue twice and not at the head', () => {
        let project: IProject | undefined = undefined;
        beforeAll(async () => {
            MockDate.set(STRICT_DATE);
            project = await CREATE_PROJECT();
            expect(await new AddMe().relax({ ...TEST_INITIATIVE, user: TEST_OTHER_USER })).toEqual(
                'Successfully added "other user name" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. other user name (May 6, 2021 01:43:08 AM EST)'
            );
            MockDate.set(STRICT_DATE + TWO_SECONDS);
            expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual(
                `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. other user name (May 6, 2021 01:43:08 AM EST)\n2. ${STANDARD_USER.displayName} (May 6, 2021 01:43:10 AM EST)`
            );
            MockDate.set(STRICT_DATE + FOUR_SECONDS);
            expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual(
                `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. other user name (May 6, 2021 01:43:08 AM EST)\n2. ${STANDARD_USER.displayName} (May 6, 2021 01:43:10 AM EST)\n3. ${STANDARD_USER.displayName} (May 6, 2021 01:43:12 AM EST)`
            );

            project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
            const newQueue = project.queues.filter(i => i.name === project?.currentQueue)[0];
            expect(newQueue.members).toHaveLength(3);  // eslint-disable-line @typescript-eslint/no-magic-numbers
            expect(newQueue.members[0]).toEqual(expect.objectContaining({
                atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
                enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
            }));
            expect(newQueue.members[0].person).toEqual(expect.objectContaining({
                id: TEST_OTHER_USER.id,
                displayName: TEST_OTHER_USER.displayName
            }));
            expect(newQueue.members[1]).toEqual(expect.objectContaining({
                atHeadTime: null,  // Not at the queue's head
                enqueuedAt: new Date('2021-05-06T05:43:10.056Z')
            }));
            expect(newQueue.members[1].person).toEqual(expect.objectContaining(TEST_INITIATIVE.user));
            expect(newQueue.members[2]).toEqual(expect.objectContaining({
                atHeadTime: null,  // Not at the queue's head
                enqueuedAt: new Date('2021-05-06T05:43:12.056Z')
            }));
            expect(newQueue.members[2].person).toEqual(expect.objectContaining(TEST_INITIATIVE.user));
        });
        afterAll(() => {
            MockDate.reset();
        });
        test('validate', async () => {
            MockDate.set(STRICT_DATE + TEN_SECONDS);
            expect(await new RemoveMe().relax(TEST_INITIATIVE)).toEqual(`Successfully removed "${STANDARD_USER.displayName}" from queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. other user name (May 6, 2021 01:43:08 AM EST)\n2. ${STANDARD_USER.displayName} (May 6, 2021 01:43:12 AM EST)\n\nother user name, you're at the front of the queue!`);

            // Verify
            const person = (await PERSON_MODEL.find({ id: TEST_INITIATIVE.user.id }).exec())[0];
            expect(person).toEqual(expect.objectContaining({
                // Was never at head so values are zero
                atHeadCount: 0,
                atHeadSeconds: 0,
                displayName: STANDARD_USER.displayName,
                id: STANDARD_USER.id,
                inQueueCount: 1,
                inQueueSeconds: 8 // (8 seconds total in queue = -10 + 2)
            }));
            const newPerson = (await PERSON_MODEL.find({ id: TEST_OTHER_USER.id }).exec())[0];
            expect(newPerson).toEqual(expect.objectContaining({
                // At head, but never removed from queue
                atHeadCount: 0,
                atHeadSeconds: 0,
                displayName: 'other user name',
                id: 'otherUser',
                // never removed from queue
                inQueueCount: 0,
                inQueueSeconds: 0
            }));

            const resultProject = (await PROJECT_MODEL.find({ name: project?.name }).exec())[0];
            const queue = resultProject.queues.filter(i => i.name === resultProject.currentQueue)[0];
            expect(queue.members).toHaveLength(2);
            // Should contain the first and last one added
            expect(queue.members[0]).toEqual(expect.objectContaining({
                atHeadTime: new Date('2021-05-06T05:43:08.056Z'),

                // Enqueued at (-5 +2 seconds)
                enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
            }));
            expect(queue.members[0].person).toEqual(expect.objectContaining({
                id: TEST_OTHER_USER.id,
                displayName: TEST_OTHER_USER.displayName
            }));
            expect(queue.members[1]).toEqual(expect.objectContaining({
                atHeadTime: null,

                // Enqueued at (-5 +2 seconds)
                enqueuedAt: new Date('2021-05-06T05:43:12.056Z')
            }));
            expect(queue.members[1].person).toEqual(expect.objectContaining(TEST_INITIATIVE.user));
        });
    });

    describe('Correctly tags someone else when, after removal, they are at the head of the queue and in a group', () => {
        let project: IProject | undefined = undefined;
        const testInitiativeRoom = TEST_INITIATIVE;
        beforeAll(async () => {
            MockDate.set(STRICT_DATE);
            testInitiativeRoom.destination = { roomId: STANDARD_USER.id };
            project = await CREATE_PROJECT({ destination: testInitiativeRoom.destination, registration: true });
            expect(await new AddMe().relax(testInitiativeRoom)).toEqual(
                `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)`
            );
            MockDate.set(STRICT_DATE + TWO_SECONDS);
            expect(await new AddMe().relax({ ...testInitiativeRoom, user: TEST_OTHER_USER })).toEqual(
                `Successfully added "other user name" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)\n2. other user name (May 6, 2021 01:43:10 AM EST)`
            );

            project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
            const newQueue = project.queues.filter(i => i.name === project?.currentQueue)[0];
            expect(newQueue.members).toHaveLength(2);
            expect(newQueue.members[0]).toEqual(expect.objectContaining({
                atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
                enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
            }));
            expect(newQueue.members[0].person).toEqual(expect.objectContaining(testInitiativeRoom.user));
            expect(newQueue.members[1]).toEqual(expect.objectContaining({
                atHeadTime: null,  // Not at the queue's head
                enqueuedAt: new Date('2021-05-06T05:43:10.056Z')
            }));
            expect(newQueue.members[1].person).toEqual(expect.objectContaining({
                id: TEST_OTHER_USER.id,
                displayName: TEST_OTHER_USER.displayName
            }));
        });
        afterAll(() => {
            MockDate.reset();
        });
        test('validate', async () => {
            MockDate.set(STRICT_DATE + FIVE_SECONDS);
            expect(await new RemoveMe().relax(testInitiativeRoom)).toEqual(`Successfully removed "${STANDARD_USER.displayName}" from queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. other user name (May 6, 2021 01:43:10 AM EST)\n\n<@personId:otherUser|other user name>, you're at the front of the queue!`);
        });
    });
    test('removes me successfully to non-default queue and validates side effects when project exists', async () => {
        // TODO: do this when "set queue" tests are written
    });
    test('errors when user is in a queue on the project, but not on the current queue', async () => {
        // TODO: do this when "set queue" tests are written
    });
});