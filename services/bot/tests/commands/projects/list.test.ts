/**
 * @file Test file for the "list projects" command.
 * @author Ava Thorn
 */
import { List } from '../../../src/commands/projects/list';
import { Create } from '../../../src/commands/projects/create';
import { PROJECT_MODEL } from '../../../src/models/project';
import { TEST_INITIATIVE, SUPER_ADMIN, STANDARD_USER, PROJECT_ADMIN } from '../../util';

TEST_INITIATIVE.data = {};
TEST_INITIATIVE.rawCommand = 'list projects';
TEST_INITIATIVE.action = new List();
TEST_INITIATIVE.user = SUPER_ADMIN;

describe('List project works appropriately', () => {
    test('projects are listed when no projects exist', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new List().relax(TEST_INITIATIVE)).toEqual('There are no projects configured.');
    });
    test('projects are listed when there is 1 project', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax({ ...TEST_INITIATIVE, data: { name: 'foo' } })).toEqual('Successfully created "FOO"');
        expect(await new List().relax(TEST_INITIATIVE)).toEqual('List of projects are:\n\n1. FOO');
    });
    test('projects are listed when there is 3 projects', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax({ ...TEST_INITIATIVE, data: { name: 'foo' } })).toEqual('Successfully created "FOO"');
        let newProject = TEST_INITIATIVE;
        newProject.data.name = 'project1';
        expect(await new Create().relax(newProject)).toEqual('Successfully created "PROJECT1"');
        newProject = TEST_INITIATIVE;
        newProject.data.name = 'project2';
        expect(await new Create().relax(newProject)).toEqual('Successfully created "PROJECT2"');
        expect(await new List().relax(newProject)).toEqual('List of projects are:\n\n1. FOO\n2. PROJECT1\n3. PROJECT2');
    });
    test('Errors when a project admin tries to list projects', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax({ ...TEST_INITIATIVE, data: { name: 'foo' } })).toEqual('Successfully created "FOO"');
        expect(await new List().relax({ ...TEST_INITIATIVE, user: PROJECT_ADMIN })).toEqual('You are not authorized to perform that action. Please ask an administrator.');
    });
    test('Errors when a non-admin tries to list projects', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax({ ...TEST_INITIATIVE, data: { name: 'foo' } })).toEqual('Successfully created "FOO"');
        expect(await new List().relax({ ...TEST_INITIATIVE, user: STANDARD_USER })).toEqual('You are not authorized to perform that action. Please ask an administrator.');
    });
});