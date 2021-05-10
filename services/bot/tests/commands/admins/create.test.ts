/**
 * @file Test file for the "create admin" command.
 * @author Ava Thorn
 */
import { Create } from '../../../src/commands/admins/create';
import { PROJECT_MODEL } from '../../../src/models/project';
import { CREATE_PROJECT, TEST_INITIATIVE, PROJECT_ADMIN, STANDARD_USER, SUPER_ADMIN } from '../../util';
import { BOT } from '../../../src/bot';

const NEW_ADMIN = { id: 'newAdminId', displayName: 'DISPLAY ADMIN NEW' };

TEST_INITIATIVE.data = { name: NEW_ADMIN.displayName };
TEST_INITIATIVE.rawCommand = `create admin ${NEW_ADMIN.displayName}`;
TEST_INITIATIVE.action = new Create();
TEST_INITIATIVE.mentions = [NEW_ADMIN.id];
TEST_INITIATIVE.user = PROJECT_ADMIN;
describe('Create admin works appropriately', () => {
    test('Adds appropriately when user is not already an admin', async () => {
        let project = await CREATE_PROJECT();
        expect(project.admins).toHaveLength(1);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));
        // Set up mock to received admin GET request
        BOT.people.get.mockReturnValueOnce(NEW_ADMIN);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual(`Successfully added "${NEW_ADMIN.displayName}" as an admin.`);
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        expect(project.admins).toHaveLength(2);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));
        expect(project.admins[1]).toEqual(expect.objectContaining(NEW_ADMIN));
    });
    test('Adds appropriately when user is not already an admin and caller is super admin', async () => {
        let project = await CREATE_PROJECT();
        expect(project.admins).toHaveLength(1);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));
        TEST_INITIATIVE.user = SUPER_ADMIN;
        // Set up mock to received admin GET request
        BOT.people.get.mockReturnValueOnce(NEW_ADMIN);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual(`Successfully added "${NEW_ADMIN.displayName}" as an admin.`);
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        expect(project.admins).toHaveLength(2);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));
        expect(project.admins[1]).toEqual(expect.objectContaining(NEW_ADMIN));
    });
});

describe('Create admin errors when it should', () => {
    test('Errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('Errors when admin is already added to the project', async () => {
        let project = await CREATE_PROJECT();
        expect(project.admins).toHaveLength(1);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));
        TEST_INITIATIVE.mentions = [PROJECT_ADMIN.id];
        TEST_INITIATIVE.user = PROJECT_ADMIN;
        // Set up mock to received admin GET request
        BOT.people.get.mockReturnValueOnce(PROJECT_ADMIN);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual(`"${PROJECT_ADMIN.displayName}" is already an admin.`);
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        expect(project.admins).toHaveLength(1);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));
    });
    test('Errors when no admin is tagged', async () => {
        let project = await CREATE_PROJECT();
        expect(project.admins).toHaveLength(1);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));
        TEST_INITIATIVE.mentions = [];
        TEST_INITIATIVE.user = PROJECT_ADMIN;
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('No tags found. Please tag a user in order to create an admin.');
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        // Set up mock to received admin GET request
        expect(BOT.people.get).not.toHaveBeenCalled();
        expect(project.admins).toHaveLength(1);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));
    });
    test('Authorization: Errors when caller is not a project admin or super admin', async () => {
        let project = await CREATE_PROJECT();
        expect(project.admins).toHaveLength(1);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));
        TEST_INITIATIVE.mentions = [STANDARD_USER.id];
        TEST_INITIATIVE.user = STANDARD_USER;
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('You are not authorized to perform that action. Please ask an administrator.');
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        // Set up mock to received admin GET request
        expect(BOT.people.get).not.toHaveBeenCalled();
        expect(project.admins).toHaveLength(1);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));
    });
});