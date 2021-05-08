import { Create } from '../../../src/commands/projects/create';
import { PROJECT_MODEL } from '../../../src/models/project';
import * as settings from '../../../src/settings.json';
import { TEST_INITIATIVE } from '../../util';

TEST_INITIATIVE.data = { name: 'foo' };
TEST_INITIATIVE.rawCommand = 'create project foo';
TEST_INITIATIVE.action = new Create();
describe('Create project works appropriately', () => {
    test('project is created when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('Successfully created "FOO"');
        const projects = await PROJECT_MODEL.find({}).exec();
        expect(projects).toHaveLength(1);
    });
    test('project is created with default queue', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('Successfully created "FOO"');
        const projects = await PROJECT_MODEL.find({}).exec();
        expect(projects[0].queues).toHaveLength(1);
        expect(projects[0].queues[0]).toHaveProperty('name');
        expect(projects[0].queues[0].name).toStrictEqual(settings.DEFAULT_QUEUE_NAME);
        expect(projects[0].currentQueue).toStrictEqual(settings.DEFAULT_QUEUE_NAME);
    });
    test('project is created with default admin', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('Successfully created "FOO"');
        const projects = await PROJECT_MODEL.find({}).exec();
        expect(projects[0].admins).toHaveLength(1);
        expect(projects[0].admins[0]).toHaveProperty('id');
        expect(projects[0].admins[0]).toHaveProperty('displayName');
        expect(projects[0].admins[0].id).toStrictEqual(TEST_INITIATIVE.user.id);
        expect(projects[0].admins[0].displayName).toStrictEqual(TEST_INITIATIVE.user.displayName);
    });
    test('project is not created when project is already configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('Successfully created "FOO"');
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('A project with name "FOO" already exists.');
    });
    test('project is created when a project is already configured, but no conflict', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('Successfully created "FOO"');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        const newProject = TEST_INITIATIVE;
        newProject.data.name = 'new project name';
        expect(await new Create().relax(newProject)).toEqual('Successfully created "NEW PROJECT NAME"');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(2);
    });
});