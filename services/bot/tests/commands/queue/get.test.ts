/**
 * @file Test file for the "add me" command.
 * @author Ava Thorn
 */
import { AddMe } from '../../../src/commands/queue/addMe';
import { Get } from '../../../src/commands/queue/get';
import { PROJECT_MODEL } from '../../../src/models/project';
import { PERSON_MODEL } from '../../../src/models/person';
import MockDate from 'mockdate';
import { CREATE_PROJECT, TEST_INITIATIVE, TEST_PROJECT, STANDARD_USER, STRICT_DATE, CREATE_QUEUE } from '../../util';

TEST_INITIATIVE.rawCommand = 'get queue';
TEST_INITIATIVE.action = new Get();

describe('Getting a queue works appropriately', () => {
    beforeAll(() => {
        MockDate.set(STRICT_DATE);
    });
    afterAll(() => {
        MockDate.reset();
    });

    test('errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Get().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('Gets queue successfully when project exists', async () => {
        const project = await CREATE_PROJECT();
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(project.admins).toEqual(expect.arrayContaining([expect.objectContaining(TEST_PROJECT.admins[0])]));
        expect(await PERSON_MODEL.find({ id: TEST_INITIATIVE.user.id }).exec()).toHaveLength(0);

        expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual(
            `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)`
        );
        expect(await new Get().relax(TEST_INITIATIVE)).toEqual(
            `Queue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)\n\nYou are at the head of the queue so you have no estimated wait time!`
        );
    });
    test('Gets non-default queue successfully when project exists', async () => {
        let project = await CREATE_PROJECT();
        await CREATE_QUEUE(project, 'FOO');
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(project.admins).toEqual(expect.arrayContaining([expect.objectContaining(TEST_PROJECT.admins[0])]));
        expect(await PERSON_MODEL.find({ id: TEST_INITIATIVE.user.id }).exec()).toHaveLength(0);

        expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual(
            `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)`
        );
        expect(await new Get().relax(TEST_INITIATIVE)).toEqual(
            `Queue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)\n\nYou are at the head of the queue so you have no estimated wait time!`
        );

        expect(await new AddMe().relax({ ...TEST_INITIATIVE, data: { queue: 'FOO' } })).toEqual(
            `Successfully added "${STANDARD_USER.displayName}" to queue "FOO".\n\nQueue "FOO":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)`
        );
        expect(await new Get().relax({ ...TEST_INITIATIVE, data: { queue: 'FOO' } })).toEqual(
            `Queue "FOO":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)\n\nYou are at the head of the queue so you have no estimated wait time!`
        );
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];

        const defaultQueue = project.queues.filter(i => i.name === project.currentQueue)[0];
        const newQueue = project.queues.filter(i => i.name === 'FOO')[0];
        expect(defaultQueue.members).toHaveLength(1);
        expect(newQueue.members).toHaveLength(1);
    });
    test('Returns how long when there are multiple people in front, all have saved queue data', async () => {
        let project = await CREATE_PROJECT();
        const person1 = { id: 'user1', displayName: 'user one' };
        /* eslint-disable @typescript-eslint/no-magic-numbers */
        // There's a lot of magic numbers here, ignore the linter for this section
        await PERSON_MODEL.build({
            ...person1,
            inQueueCount: 5,
            inQueueSeconds: 30,
            atHeadSeconds: 100,
            atHeadCount: 3
        }).save();
        await new AddMe().relax({ ...TEST_INITIATIVE, user: person1 });

        const person2 = { id: 'user2', displayName: 'user two' };
        await PERSON_MODEL.build({
            ...person2,
            inQueueCount: 10,
            inQueueSeconds: 583,
            atHeadSeconds: 283,
            atHeadCount: 6
        }).save();
        await new AddMe().relax({ ...TEST_INITIATIVE, user: person2 });

        const person3 = { id: 'user3', displayName: 'user three' };
        await PERSON_MODEL.build({
            ...person3,
            inQueueCount: 123,
            inQueueSeconds: 28378,
            atHeadSeconds: 2939,
            atHeadCount: 52
        }).save();
        await new AddMe().relax({ ...TEST_INITIATIVE, user: person3 });

        project = (await PROJECT_MODEL.find({}).exec())[0];
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];

        expect(queue.members).toHaveLength(3);
        expect(queue.members[0].person).toEqual(expect.objectContaining(person1));
        expect(queue.members[1].person).toEqual(expect.objectContaining(person2));
        expect(queue.members[2].person).toEqual(expect.objectContaining(person3));

        MockDate.set(STRICT_DATE + 10000); // should reduce "how long" by 10 seconds
        // should be (100/3) + (283/6) - 10 = 70.5 seconds = 00:01:10
        expect(await new Get().relax({ ...TEST_INITIATIVE, user: person3 })).toEqual(
            'Queue "DEFAULT":\n\n1. user one (May 6, 2021 01:43:08 AM EST)\n2. user two (May 6, 2021 01:43:08 AM EST)\n3. user three (May 6, 2021 01:43:08 AM EST)\n\nGiven that there are 2 people ahead of you. Your estimated wait time is 00:01:10'
        );

        // should be (100/3) + (283/6) - 30 = 50.5 seconds = 00:00:50
        MockDate.set(STRICT_DATE + 30000); // should reduce "how long" by 30 seconds
        expect(await new Get().relax({ ...TEST_INITIATIVE, user: person2 })).toEqual(
            'Queue "DEFAULT":\n\n1. user one (May 6, 2021 01:43:08 AM EST)\n2. user two (May 6, 2021 01:43:08 AM EST)\n3. user three (May 6, 2021 01:43:08 AM EST)\n\nGiven that there is 1 person ahead of you. Your estimated wait time is 00:00:03'
        );

        expect(queue.members).toHaveLength(3);
        expect(queue.members[0].person).toEqual(expect.objectContaining(person1));
        expect(queue.members[1].person).toEqual(expect.objectContaining(person2));
        expect(queue.members[2].person).toEqual(expect.objectContaining(person3));
        /* eslint-enable @typescript-eslint/no-magic-numbers */
    });
});