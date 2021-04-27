import { Create } from '../../../src/commands/projects/create';

const TEST_PROJECT = {
    data: { name: 'foo' },
    rawCommand: 'create project foo',
    destination: { toPersonId: 'notReal' },
    action: new Create()
};

describe('Create project works appropriately', () => {
    test('project is created when no projects are configured', async () => {
        expect(await new Create().relax(TEST_PROJECT)).toEqual('Successfully created "foo"');
    });
    test('project is not created when project is already configured', async () => {
        expect(await new Create().relax(TEST_PROJECT)).toEqual('Successfully created "foo"');
        expect(await new Create().relax(TEST_PROJECT)).toEqual('A project with name "foo" already exists.');
    });
    test('project is created when a project is already configured, but no conflict', async () => {
        expect(await new Create().relax(TEST_PROJECT)).toEqual('Successfully created "foo"');
        const newProject = TEST_PROJECT;
        newProject.data.name = 'new project name';
        expect(await new Create().relax(newProject)).toEqual('Successfully created "new project name"');
    });
});