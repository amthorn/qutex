/**
 * @file Test file for the "how long" command.
 * @author Ava Thorn
 */
import { HowLong } from '../../../src/commands/queue/howLong';
import { AddMe } from '../../../src/commands/queue/addMe';
import { PROJECT_MODEL } from '../../../src/models/project';
import { PERSON_MODEL } from '../../../src/models/person';
import MockDate from 'mockdate';
import { CREATE_PROJECT, TEST_INITIATIVE, TEST_OTHER_USER, STRICT_DATE } from '../../util';

TEST_INITIATIVE.rawCommand = 'remove me';
TEST_INITIATIVE.action = new HowLong();

describe('getting "how long" for a queue works appropriately', () => {
    test('When user is not in the queue, returns the total length of time to get to the head', async () => {
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
        // should be (100/3) + (283/6) + (2939/52) - 10 = 127.01923076923077 seconds = 00:02:07
        expect(await new HowLong().relax(TEST_INITIATIVE)).toEqual(
            'Given that there are 3 people ahead of you. Your estimated wait time is 00:02:07'
        );

        // should be (100/3) + (283/6) + (2939/52) - 30 = 107.01923076923077 seconds = 00:01:47
        MockDate.set(STRICT_DATE + 30000); // should reduce "how long" by 30 seconds
        expect(await new HowLong().relax(TEST_INITIATIVE)).toEqual('Given that there are 3 people ahead of you. Your estimated wait time is 00:01:47');

        expect(queue.members).toHaveLength(3);
        expect(queue.members[0].person).toEqual(expect.objectContaining(person1));
        expect(queue.members[1].person).toEqual(expect.objectContaining(person2));
        expect(queue.members[2].person).toEqual(expect.objectContaining(person3));
        /* eslint-enable @typescript-eslint/no-magic-numbers */
    });

    test('When user is not in the queue and queue is empty, returns 0', async () => {
        const project = await CREATE_PROJECT();
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(await new HowLong().relax(TEST_INITIATIVE)).toEqual('Given that there are 0 people ahead of you. Your estimated wait time is 00:00:00');
        expect(queue.members).toHaveLength(0);
    });
    test('When user is in the queue more than 1 time, returns the length of time for first instance to get to head', async () => {

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
        await new AddMe().relax({ ...TEST_INITIATIVE, user: person2 });

        project = (await PROJECT_MODEL.find({}).exec())[0];
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];

        expect(queue.members).toHaveLength(4);
        expect(queue.members[0].person).toEqual(expect.objectContaining(person1));
        expect(queue.members[1].person).toEqual(expect.objectContaining(person2));
        expect(queue.members[2].person).toEqual(expect.objectContaining(person3));
        expect(queue.members[3].person).toEqual(expect.objectContaining(person2));

        MockDate.set(STRICT_DATE + 10000); // should reduce "how long" by 10 seconds
        // should be (100/3) - 10 = 23.333333336 seconds = 00:00:23
        expect(await new HowLong().relax({ ...TEST_INITIATIVE, user: person2 })).toEqual(
            'Given that there is 1 person ahead of you. Your estimated wait time is 00:00:23'
        );

        // should be (100/3) - 30 = 3.333333336 seconds = 00:00:3
        MockDate.set(STRICT_DATE + 30000); // should reduce "how long" by 30 seconds
        expect(await new HowLong().relax({ ...TEST_INITIATIVE, user: person2 })).toEqual(
            'Given that there is 1 person ahead of you. Your estimated wait time is 00:00:03'
        );

        expect(queue.members).toHaveLength(4);
        expect(queue.members[0].person).toEqual(expect.objectContaining(person1));
        expect(queue.members[1].person).toEqual(expect.objectContaining(person2));
        expect(queue.members[2].person).toEqual(expect.objectContaining(person3));
        expect(queue.members[3].person).toEqual(expect.objectContaining(person2));
        /* eslint-enable @typescript-eslint/no-magic-numbers */
    });
    test('Returns how long when there is only one person in front who has no saved queue data', async () => {
        // TODO:
    });
    test('Returns how long when there is only one person in front who has saved queue data', async () => {
        // TODO:
    });
    test('Returns how long when there are multiple people in front, all have no saved queue data', async () => {
        // TODO:
    });
    test('Returns how long when there are multiple people in front, only head has saved queue data', async () => {
        // TODO:
    });
    test('Returns how long when there are multiple people in front, everyone except head has saved queue data', async () => {
        // TODO:
    });
    test('Returns how long when there are multiple people in front, some but not all have saved queue data', async () => {
        // TODO:
    });
    test('Returns how long when there are multiple people in front, all have saved queue data', async () => {
        // TODO:
    });
});
describe('getting "how long" for a queue errors when it should', () => {
    test('errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new HowLong().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('errors if user is at the head of the queue', async () => {
        let project = await CREATE_PROJECT();
        const person = { id: TEST_OTHER_USER.id, displayName: TEST_OTHER_USER.displayName };
        await new AddMe().relax({ ...TEST_INITIATIVE, user: person });

        project = (await PROJECT_MODEL.find({}).exec())[0];
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];

        expect(queue.members).toHaveLength(1);
        expect(queue.members[0].person).toEqual(expect.objectContaining(person));

        expect(await new HowLong().relax({ ...TEST_INITIATIVE, user: person })).toEqual('You are already at the head of the queue');
        expect(queue.members).toHaveLength(1);
    });
});