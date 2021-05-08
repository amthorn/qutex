import { List } from '../../../src/commands/projects/list';
import { Create } from '../../../src/commands/projects/create';
import { PROJECT_MODEL } from '../../../src/models/project';

const TEST_INITIATIVE = {
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
        expect(await new List().relax(TEST_INITIATIVE)).toEqual('There are no projects configured.');
    });
    test('projects are listed when there is 1 project', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('Successfully created "FOO"');
        expect(await new List().relax(TEST_INITIATIVE)).toEqual('List of projects are:\n\n1. FOO');
    });
    test('projects are listed when there is 3 projects', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('Successfully created "FOO"');
        let newProject = TEST_INITIATIVE;
        newProject.data.name = 'project1';
        expect(await new Create().relax(newProject)).toEqual('Successfully created "PROJECT1"');
        newProject = TEST_INITIATIVE;
        newProject.data.name = 'project2';
        expect(await new Create().relax(newProject)).toEqual('Successfully created "PROJECT2"');
        expect(await new List().relax(newProject)).toEqual('List of projects are:\n\n1. FOO\n2. PROJECT1\n3. PROJECT2');
    });
});