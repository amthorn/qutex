/**
 * @file Test file for the "set queue to" command.
 * @author Ava Thorn
 */
import { SetCurrentQueue } from '../../../src/commands/projects/setCurrentQueue';
import { List } from '../../../src/commands/queues/list';
import { PROJECT_MODEL } from '../../../src/models/project';
import { CREATE_PROJECT, CREATE_QUEUE, TEST_PROJECT, TEST_INITIATIVE } from '../../util';
import * as settings from '../../../src/settings.json';

TEST_INITIATIVE.data = { name: 'QNAME' };
TEST_INITIATIVE.rawCommand = 'set queue to QNAME';
TEST_INITIATIVE.action = new SetCurrentQueue();

describe('Setting the current queue on a project works appropriately', () => {
    test('Setting the current queue when no project exists fails', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new SetCurrentQueue().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('Setting the current queue to nonexistent queue', async () => {
        const project = await CREATE_PROJECT();
        expect(project.currentQueue).toEqual(settings.DEFAULT_QUEUE_NAME);
        await CREATE_QUEUE(project, 'fooQName');
        expect(project.currentQueue).toEqual(settings.DEFAULT_QUEUE_NAME);
        const message = `Queue "${TEST_INITIATIVE.data.name}" does not exist on project "${TEST_PROJECT.name}"`;
        expect(await new SetCurrentQueue().relax(TEST_INITIATIVE)).toEqual(message);
        expect(project.currentQueue).toEqual(settings.DEFAULT_QUEUE_NAME);
    });
    test('Setting the current queue to the same queue it is already set as', async () => {
        const project = await CREATE_PROJECT();
        expect(project.currentQueue).toEqual(settings.DEFAULT_QUEUE_NAME);
        await CREATE_QUEUE(project, 'fooQName');
        expect(project.currentQueue).toEqual(settings.DEFAULT_QUEUE_NAME);
        expect(await new SetCurrentQueue().relax({
            ...TEST_INITIATIVE,
            data: { name: settings.DEFAULT_QUEUE_NAME },
            rawCommand: `set queue to ${settings.DEFAULT_QUEUE_NAME}`
        })).toEqual(`Current queue is already set to "${settings.DEFAULT_QUEUE_NAME}"`);
        expect(project.currentQueue).toEqual(settings.DEFAULT_QUEUE_NAME);
    });
    test('Setting the current queue in a valid setting', async () => {
        const project = await CREATE_PROJECT();
        expect(project.currentQueue).toEqual(settings.DEFAULT_QUEUE_NAME);
        const queue = await CREATE_QUEUE(project, 'QNAME');
        expect(project.currentQueue).toEqual(settings.DEFAULT_QUEUE_NAME);
        expect(await new SetCurrentQueue().relax({
            ...TEST_INITIATIVE,
            data: { name: queue.name },
            rawCommand: `set queue to ${queue.name}`
        })).toEqual(`Successfully set "${queue.name}" as current queue.`);
        expect(project.currentQueue).toEqual(settings.DEFAULT_QUEUE_NAME);
        expect(await new List().relax({
            ...TEST_INITIATIVE,
            data: {},
            rawCommand: 'list queues'
        })).toEqual(`List of queues in project "PNAME" are:

1. DEFAULT
2. QNAME \\*

\\* indicates current queue.`);

    });
});