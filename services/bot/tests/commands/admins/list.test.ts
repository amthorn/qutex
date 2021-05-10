/**
 * @file Test file for the "list admins" command.
 * @author Ava Thorn
 */
import { List } from '../../../src/commands/admins/list';
import { PROJECT_MODEL } from '../../../src/models/project';
import { REGISTRATION_MODEL } from '../../../src/models/registration';
import { CREATE_PROJECT, STANDARD_USER, TEST_INITIATIVE } from '../../util';

TEST_INITIATIVE.data = {};
TEST_INITIATIVE.rawCommand = 'list admins';
TEST_INITIATIVE.action = new List();

describe('List admin errors when it should', () => {
    test('Errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new List().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('Errors when no projects are registered', async () => {
        await CREATE_PROJECT({ registration: false });
        expect(await new List().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(0);
    });
});

describe('List admin works appropriately', () => {
    test('List admins works when admins exist', async () => {
        await CREATE_PROJECT();
        expect(await new List().relax(TEST_INITIATIVE)).toEqual('List of admins are:\n\n1. ANAME');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(1);
    });
    test('list admins works when there are no admins', async () => {
        await CREATE_PROJECT({ admins: [] });
        expect(await new List().relax(TEST_INITIATIVE)).toEqual('There are no admins configured.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(1);
    });
    test('list admins works for any user', async () => {
        await CREATE_PROJECT();
        TEST_INITIATIVE.user = STANDARD_USER;
        expect(await new List().relax(TEST_INITIATIVE)).toEqual('List of admins are:\n\n1. ANAME');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(1);
    });
});