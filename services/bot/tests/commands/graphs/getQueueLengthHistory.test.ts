/**
 * @file Test file for the "get queue length history" command.
 * @author Ava Thorn
 */
import { Get } from '../../../src/commands/graphs/queueLengthHistory';
import { AddMe } from '../../../src/commands/queue/addMe';
import { PROJECT_MODEL } from '../../../src/models/project';
import { BOT } from '../../../src/bot';
import MockDate from 'mockdate';
import { CREATE_PROJECT, TEST_INITIATIVE, STRICT_DATE, STANDARD_USER, CREATE_QUEUE } from '../../util';

TEST_INITIATIVE.rawCommand = 'get largest queue depth';
TEST_INITIATIVE.action = new Get();

describe('Getting queue length history works appropriately', () => {
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

        expect(await new Get().relax({ ...TEST_INITIATIVE, user: STANDARD_USER })).toEqual('This queue has no history.');
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

        expect(await new Get().relax(TEST_INITIATIVE)).toEqual('');
        expect(BOT.messages.create).toBeCalledWith({
            'files': ['myShortUrl'],
            'markdown': 'Click [here](myShortUrl) to see your chart in a browser!',
            'toPersonId': 'notReal'
        });
    });
    test('Should return the correct largest queue result for non-default queue', async () => {
        const project = await CREATE_PROJECT();
        await CREATE_QUEUE(project, 'FOO');
        let queue = project.queues.filter(i => i.name === 'FOO')[0];
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

        expect(await new Get().relax({ ...TEST_INITIATIVE, data: { queue: 'FOO' } })).toEqual('');
        expect(BOT.messages.create).toBeCalledWith({
            'files': ['myShortUrl'],
            'markdown': 'Click [here](myShortUrl) to see your chart in a browser!',
            'toPersonId': 'notReal'
        });
    });
});

describe('Getting queue depth history errors appropriately', () => {
    test('errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Get().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });

});