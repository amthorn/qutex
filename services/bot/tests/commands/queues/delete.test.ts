/**
 * @file Test file for the "create queue" command.
 * @author Ava Thorn
 */
import { Create } from '../../../src/commands/queues/create';
import { Delete } from '../../../src/commands/queues/delete';
import { SetCurrentQueue } from '../../../src/commands/projects/setCurrentQueue';
import { PROJECT_MODEL } from '../../../src/models/project';
import * as settings from '../../../src/settings.json';
import { CREATE_PROJECT, TEST_INITIATIVE, SUPER_ADMIN, PROJECT_ADMIN, STANDARD_USER } from '../../util';

TEST_INITIATIVE.data = { name: 'foo' };
TEST_INITIATIVE.rawCommand = 'delete queue foo';
TEST_INITIATIVE.action = new Delete();
TEST_INITIATIVE.user = PROJECT_ADMIN;

describe('Delete queue works appropriately', () => {
    test('Delete queue successfully for super admin', async () => {
        const project = await CREATE_PROJECT();
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual(
            `Created queue "${TEST_INITIATIVE.data.name?.toUpperCase()}" on project "${project.name}" successfully.`
        );
        expect(await new Delete().relax({ ...TEST_INITIATIVE, user: SUPER_ADMIN })).toEqual(
            `Deleted queue "${TEST_INITIATIVE.data.name?.toUpperCase()}" on project "${project.name}" successfully.`
        );
        const projects = await PROJECT_MODEL.find({}).exec();

        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(projects[0].queues).toHaveLength(1);
        expect(projects[0].queues[0]).toEqual(expect.objectContaining({ name: settings.DEFAULT_QUEUE_NAME }));
        expect(projects[0].queues[0].members).toHaveLength(0);
        expect(projects[0].currentQueue).toStrictEqual(settings.DEFAULT_QUEUE_NAME);
    });
    test('Delete queue successfully for project admin', async () => {
        const project = await CREATE_PROJECT();
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual(
            `Created queue "${TEST_INITIATIVE.data.name?.toUpperCase()}" on project "${project.name}" successfully.`
        );
        expect(await new Delete().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN })).toEqual(
            `Deleted queue "${TEST_INITIATIVE.data.name?.toUpperCase()}" on project "${project.name}" successfully.`
        );
        const projects = await PROJECT_MODEL.find({}).exec();

        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(projects[0].queues).toHaveLength(1);
        expect(projects[0].queues[0]).toEqual(expect.objectContaining({ name: settings.DEFAULT_QUEUE_NAME }));
        expect(projects[0].queues[0].members).toHaveLength(0);
        expect(projects[0].currentQueue).toStrictEqual(settings.DEFAULT_QUEUE_NAME);
    });
});

describe('Deleting a queue errors appropriately', () => {
    test('Deleting a queue is not possible when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Delete().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('Deleting a queue is not possible when no projects are configured and super admin is the invoker', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Delete().relax({ ...TEST_INITIATIVE, user: SUPER_ADMIN })).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('Cannot delete a queue that does not exist (DEFAULT)', async () => {
        const project = await CREATE_PROJECT();
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual(
            `Created queue "${TEST_INITIATIVE.data.name?.toUpperCase()}" on project "${project.name}" successfully.`
        );
        expect(await new SetCurrentQueue().relax({
            ...TEST_INITIATIVE,
            rawCommand: `set queue to ${TEST_INITIATIVE.data.name}`,
            data: { name: TEST_INITIATIVE.data.name }
        })).toEqual(
            `Successfully set "${TEST_INITIATIVE.data.name?.toUpperCase()}" as current queue.`
        );
        expect(await new Delete().relax({
            ...TEST_INITIATIVE,
            rawCommand: `delete queue ${settings.DEFAULT_QUEUE_NAME}`,
            data: { name: settings.DEFAULT_QUEUE_NAME }
        })).toEqual(`Deleted queue "${settings.DEFAULT_QUEUE_NAME}" on project "${project.name}" successfully.`);
        expect(await new Delete().relax({
            ...TEST_INITIATIVE,
            rawCommand: `delete queue ${settings.DEFAULT_QUEUE_NAME}`,
            data: { name: settings.DEFAULT_QUEUE_NAME }
        })).toEqual(`Queue "${settings.DEFAULT_QUEUE_NAME}" doesn't exist on project "${project.name}".`);
        const projects = await PROJECT_MODEL.find({}).exec();

        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(projects[0].queues).toHaveLength(1);
        expect(projects[0].queues[0]).toEqual(expect.objectContaining({ name: TEST_INITIATIVE.data.name?.toUpperCase() }));
        expect(projects[0].currentQueue).toStrictEqual(TEST_INITIATIVE.data.name?.toUpperCase());
    });
    test('Cannot delete a queue that does not exist (NON-DEFAULT)', async () => {
        const project = await CREATE_PROJECT();
        expect(await new Delete().relax(TEST_INITIATIVE)).toEqual(
            `Queue "${TEST_INITIATIVE.data.name?.toUpperCase()}" doesn't exist on project "${project.name}".`
        );
        const projects = await PROJECT_MODEL.find({}).exec();

        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(projects[0].queues).toHaveLength(1);
        expect(projects[0].queues[0]).toEqual(expect.objectContaining({ name: settings.DEFAULT_QUEUE_NAME }));
        expect(projects[0].queues[0].members).toHaveLength(0);
        expect(projects[0].currentQueue).toStrictEqual(settings.DEFAULT_QUEUE_NAME);
    });
    test('Cannot delete queue if issued by standard user', async () => {
        const project = await CREATE_PROJECT();
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual(
            `Created queue "${TEST_INITIATIVE.data.name?.toUpperCase()}" on project "${project.name}" successfully.`
        );
        expect(await new Delete().relax({ ...TEST_INITIATIVE, user: STANDARD_USER })).toEqual(
            'You are not authorized to perform that action. Please ask an administrator.'
        );
        const projects = await PROJECT_MODEL.find({}).exec();

        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(projects[0].queues).toHaveLength(2);
        expect(projects[0].queues[0]).toEqual(expect.objectContaining({ name: settings.DEFAULT_QUEUE_NAME }));
        expect(projects[0].queues[0].members).toHaveLength(0);
        expect(projects[0].queues[1]).toEqual(expect.objectContaining({ name: TEST_INITIATIVE.data.name?.toUpperCase() }));
        expect(projects[0].queues[1].members).toHaveLength(0);
        expect(projects[0].currentQueue).toStrictEqual(settings.DEFAULT_QUEUE_NAME);
    });
    test('Cannot delete queue if there is only one queue', async () => {
        await CREATE_PROJECT();
        expect(await new Delete().relax({ ...TEST_INITIATIVE, data: { name: settings.DEFAULT_QUEUE_NAME } })).toEqual(
            'You must have at least one queue configured on the project.'
        );
        const projects = await PROJECT_MODEL.find({}).exec();

        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(projects[0].queues).toHaveLength(1);
        expect(projects[0].queues[0]).toEqual(expect.objectContaining({ name: settings.DEFAULT_QUEUE_NAME }));
        expect(projects[0].queues[0].members).toHaveLength(0);
        expect(projects[0].currentQueue).toStrictEqual(settings.DEFAULT_QUEUE_NAME);
    });
    test('Cannot delete queue if it is the current queue', async () => {
        const project = await CREATE_PROJECT();
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual(
            `Created queue "${TEST_INITIATIVE.data.name?.toUpperCase()}" on project "${project.name}" successfully.`
        );
        expect(await new Delete().relax({ ...TEST_INITIATIVE, data: { name: settings.DEFAULT_QUEUE_NAME } })).toEqual(
            `Queue "${settings.DEFAULT_QUEUE_NAME}" is the current queue. You must change the current queue before you can delete it.`
        );
        const projects = await PROJECT_MODEL.find({}).exec();

        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(projects[0].queues).toHaveLength(2);
        expect(projects[0].queues[0]).toEqual(expect.objectContaining({ name: settings.DEFAULT_QUEUE_NAME }));
        expect(projects[0].queues[0].members).toHaveLength(0);
        expect(projects[0].queues[1]).toEqual(expect.objectContaining({ name: TEST_INITIATIVE.data.name?.toUpperCase() }));
        expect(projects[0].queues[1].members).toHaveLength(0);
        expect(projects[0].currentQueue).toStrictEqual(settings.DEFAULT_QUEUE_NAME);
    });
});