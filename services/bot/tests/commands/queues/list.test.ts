/**
 * @file Test file for the "create queue" command.
 * @author Ava Thorn
 */
import { List } from '../../../src/commands/queues/list';
import { PROJECT_MODEL } from '../../../src/models/project';
import * as settings from '../../../src/settings.json';
import { CREATE_PROJECT, TEST_INITIATIVE, SUPER_ADMIN, STANDARD_USER } from '../../util';

TEST_INITIATIVE.data = {};
TEST_INITIATIVE.rawCommand = 'list queues';
TEST_INITIATIVE.action = new List();
TEST_INITIATIVE.user = STANDARD_USER;

describe('Listing queues errors when it should', () => {

    test('errors when no projects are configured and super admin is invoker', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new List().relax({ ...TEST_INITIATIVE, user: SUPER_ADMIN })).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('Listing queues is not possible when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new List().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
});

describe('Listing queues works appropriately', () => {
    test('Listing queues works successfully', async () => {
        const project = await CREATE_PROJECT();
        expect(await new List().relax(TEST_INITIATIVE)).toEqual(
            `List of queues in project "${project.name}" are:\n\n1. DEFAULT \\*\n\n\\* indicates current queue.`
        );
        const projects = await PROJECT_MODEL.find({}).exec();

        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(projects[0].queues).toHaveLength(1);
        expect(projects[0].queues[0]).toEqual(expect.objectContaining({ name: settings.DEFAULT_QUEUE_NAME }));
        expect(projects[0].queues[0].members).toHaveLength(0);
        expect(projects[0].currentQueue).toStrictEqual(settings.DEFAULT_QUEUE_NAME);
    });
});