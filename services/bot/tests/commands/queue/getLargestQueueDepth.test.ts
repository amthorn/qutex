/**
 * @file Test file for the "get largest queue depth" command.
 * @author Ava Thorn
 */
import { Get } from '../../../src/commands/queue/getLargestQueueDepth';
import { AddMe } from '../../../src/commands/queue/addMe';
import { SetCurrentQueue } from '../../../src/commands/projects/setCurrentQueue';
import { PROJECT_MODEL } from '../../../src/models/project';
import * as settings from '../../../src/settings.json';
import MockDate from 'mockdate';
import { CREATE_PROJECT, TEST_INITIATIVE, STRICT_DATE, CREATE_QUEUE, STANDARD_USER } from '../../util';

TEST_INITIATIVE.rawCommand = 'get largest queue depth';
TEST_INITIATIVE.action = new Get();

describe('Getting largest queue depth works appropriately', () => {
    beforeAll(() => {
        MockDate.set(STRICT_DATE);
    });
    afterAll(() => {
        MockDate.reset();
    });
    test('standard user can issue the command', async () => {
        const project = await CREATE_PROJECT();
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(queue.history).toHaveLength(0);

        expect(await new Get().relax({ ...TEST_INITIATIVE, user: STANDARD_USER })).toEqual(
            'This queue has no history. The largest queue depth is therefore 0.'
        );
    });
    test('Largest queue returns 0 when queue has no history', async () => {
        const project = await CREATE_PROJECT();
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(queue.history).toHaveLength(0);

        expect(await new Get().relax(TEST_INITIATIVE)).toEqual(
            'This queue has no history. The largest queue depth is therefore 0.'
        );
    });
    test('Should return the correct largest queue result when the current queue is non-default', async () => {
        let project = await CREATE_PROJECT();
        await CREATE_QUEUE(project, 'FOO');
        expect(await new SetCurrentQueue().relax({ ...TEST_INITIATIVE, data: { name: 'foo' } })).toEqual(
            'Successfully set "FOO" as current queue.'
        );
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];

        expect(project.currentQueue).toEqual('FOO');

        let queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(queue.history).toHaveLength(0);

        await new AddMe().relax(TEST_INITIATIVE);
        queue = (await PROJECT_MODEL.find({ name: project.name }).exec())[0].queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.history).toHaveLength(1);
        await new AddMe().relax(TEST_INITIATIVE);
        queue = (await PROJECT_MODEL.find({ name: project.name }).exec())[0].queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.history).toHaveLength(2);
        await new AddMe().relax(TEST_INITIATIVE);
        queue = (await PROJECT_MODEL.find({ name: project.name }).exec())[0].queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.history).toHaveLength(3); // eslint-disable-line @typescript-eslint/no-magic-numbers
        expect(queue.history[2].members).toHaveLength(3); // eslint-disable-line @typescript-eslint/no-magic-numbers
        expect(queue.history[2].time).toEqual(new Date(STRICT_DATE));

        expect(await new Get().relax(TEST_INITIATIVE)).toEqual(
            'Largest Depth is: 3\nThis occurred at: Thu May 06 2021 01:43:08 GMT-0400 (Eastern Daylight Time)'
        );

    });
    test('Should return the correct largest queue result when the current queue is default', async () => {
        const project = await CREATE_PROJECT();
        let queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(queue.history).toHaveLength(0);

        await new AddMe().relax(TEST_INITIATIVE);
        queue = (await PROJECT_MODEL.find({ name: project.name }).exec())[0].queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.history).toHaveLength(1);
        await new AddMe().relax(TEST_INITIATIVE);
        queue = (await PROJECT_MODEL.find({ name: project.name }).exec())[0].queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.history).toHaveLength(2);
        await new AddMe().relax(TEST_INITIATIVE);
        queue = (await PROJECT_MODEL.find({ name: project.name }).exec())[0].queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.history).toHaveLength(3); // eslint-disable-line @typescript-eslint/no-magic-numbers
        expect(queue.history[2].members).toHaveLength(3); // eslint-disable-line @typescript-eslint/no-magic-numbers
        expect(queue.history[2].time).toEqual(new Date(STRICT_DATE));

        expect(await new Get().relax(TEST_INITIATIVE)).toEqual(
            'Largest Depth is: 3\nThis occurred at: Thu May 06 2021 01:43:08 GMT-0400 (Eastern Daylight Time)'
        );
    });
    test('Should return the correct largest queue result for non-default queue', async () => {
        const project = await CREATE_PROJECT();

        let queue = await CREATE_QUEUE(project, 'FOO');
        expect(project.currentQueue).toEqual(settings.DEFAULT_QUEUE_NAME);
        expect(queue.members).toHaveLength(0);
        expect(queue.history).toHaveLength(0);

        await new AddMe().relax({ ...TEST_INITIATIVE, data: { queue: 'FOO' } });
        queue = (await PROJECT_MODEL.find({ name: project.name }).exec())[0].queues.filter(i => i.name === 'FOO')[0];
        expect(queue.history).toHaveLength(1);
        await new AddMe().relax({ ...TEST_INITIATIVE, data: { queue: 'FOO' } });
        queue = (await PROJECT_MODEL.find({ name: project.name }).exec())[0].queues.filter(i => i.name === 'FOO')[0];
        expect(queue.history).toHaveLength(2);
        await new AddMe().relax({ ...TEST_INITIATIVE, data: { queue: 'FOO' } });
        queue = (await PROJECT_MODEL.find({ name: project.name }).exec())[0].queues.filter(i => i.name === 'FOO')[0];
        expect(queue.history).toHaveLength(3); // eslint-disable-line @typescript-eslint/no-magic-numbers
        expect(queue.history[2].members).toHaveLength(3); // eslint-disable-line @typescript-eslint/no-magic-numbers
        expect(queue.history[2].time).toEqual(new Date(STRICT_DATE));

        expect(await new Get().relax({ ...TEST_INITIATIVE, data: { queue: 'FOO' } })).toEqual(
            'Largest Depth is: 3\nThis occurred at: Thu May 06 2021 01:43:08 GMT-0400 (Eastern Daylight Time)'
        );
    });
});

describe('Getting largest queue depth works appropriately', () => {
    test('errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Get().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });

});