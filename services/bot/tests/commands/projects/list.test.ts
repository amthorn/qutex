import { List } from '../../../src/commands/projects/list';
import { Create } from '../../../src/commands/projects/create';
import { PROJECT_MODEL } from '../../../src/models/project';

const TEST_PROJECT = {
    data: { name: 'foo' },
    rawCommand: 'create project foo',
    destination: { toPersonId: 'notReal' },
    action: new Create(),
    debug: false,
    user: {
        id: 'fooId',
        displayName: 'foo display name'
    }
};

describe('List project works appropriately', () => {
    test('projects are listed when no projects exist', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new List().relax()).toEqual('There are no projects configured.');
    });
    test('projects are listed when there is 1 project', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax(TEST_PROJECT)).toEqual('Successfully created "foo"');
        expect(await new List().relax()).toEqual('List of projects are:\n\n1. foo');
    });
    test('projects are listed when there is 3 projects', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax(TEST_PROJECT)).toEqual('Successfully created "foo"');
        let newProject = TEST_PROJECT;
        newProject.data.name = 'project1';
        expect(await new Create().relax(newProject)).toEqual('Successfully created "project1"');
        newProject = TEST_PROJECT;
        newProject.data.name = 'project2';
        expect(await new Create().relax(newProject)).toEqual('Successfully created "project2"');
        expect(await new List().relax()).toEqual('List of projects are:\n\n1. foo\n2. project1\n3. project2');
    });
});