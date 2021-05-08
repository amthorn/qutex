import { Create } from '../../../src/commands/admins/create';
import { PROJECT_MODEL } from '../../../src/models/project';
import { CREATE_PROJECT, TEST_INITIATIVE, PROJECT_ADMIN } from '../../util';
import { BOT } from '../../../src/bot';

const NEW_ADMIN = { id: 'newAdminId', displayName: 'DISPLAY ADMIN NEW' };

TEST_INITIATIVE.data = { name: NEW_ADMIN.displayName };
TEST_INITIATIVE.rawCommand = `create admin ${NEW_ADMIN.displayName}`;
TEST_INITIATIVE.action = new Create();
TEST_INITIATIVE.mentions = [NEW_ADMIN.id];
describe('Create admin works appropriately', () => {
    test('Adds appropriately when user is not already an admin', async () => { });
    test('Adds appropriately when user is not already an admin and caller is super admin', async () => { });
});

describe('Create admin errors when it should', () => {
    test('Errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('Errors when admin is already added to the project', async () => {
        const project = await CREATE_PROJECT();
        expect(project.admins).toHaveLength(1);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));
        TEST_INITIATIVE.mentions = [PROJECT_ADMIN.id];
        TEST_INITIATIVE.user = PROJECT_ADMIN;
        // Set up mock to received admin GET request
        BOT.people.get.mockReturnValueOnce(PROJECT_ADMIN);
        expect(await new Create().relax(TEST_INITIATIVE)).toEqual(`"${PROJECT_ADMIN.displayName}" is already an admin.`);
        expect(project.admins).toHaveLength(1);
        expect(project.admins[0]).toEqual(expect.objectContaining(PROJECT_ADMIN));

     });
    test('Errors when no admin is tagged', async () => {

      });
    test('Authorization: Errors when caller is not a project admin or super admin', async () => { });
});