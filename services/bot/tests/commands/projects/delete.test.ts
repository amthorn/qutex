import { CREATE_PROJECT, TEST_INITIATIVE } from '../../util';
import { Delete } from '../../../src/commands/projects/delete';
import { PROJECT_MODEL } from '../../../src/models/project';

TEST_INITIATIVE.data = { name: 'PNAME' };
TEST_INITIATIVE.rawCommand = 'delete project PNAME';
TEST_INITIATIVE.action = new Delete();
TEST_INITIATIVE.user.id = 'adminId';

describe('Delete project works appropriately', () => {
    test('project is not deleted when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Delete().relax(TEST_INITIATIVE)).toEqual('A project with name "PNAME" does not exist.');
        const projects = await PROJECT_MODEL.find({}).exec();
        expect(projects).toHaveLength(0);
    });
    test('project is deleted when the project exists and user does have permissions', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        await CREATE_PROJECT();
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await new Delete().relax(TEST_INITIATIVE)).toEqual('Successfully deleted "PNAME"');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('project is not deleted when project exists and user does not have access', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        await CREATE_PROJECT();
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await new Delete().relax({ ...TEST_INITIATIVE, user: { id: 'notAdmin' } })).toEqual('You are not authorized to perform that action. Please ask an administrator.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
    });
});