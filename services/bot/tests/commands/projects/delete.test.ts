/**
 * @file Test file for the "delete project" command.
 * @author Ava Thorn
 */
import { CREATE_PROJECT, TEST_INITIATIVE } from '../../util';
import { Delete } from '../../../src/commands/projects/delete';
import { Create } from '../../../src/commands/projects/create';
import { PROJECT_MODEL } from '../../../src/models/project';
import { REGISTRATION_MODEL } from '../../../src/models/registration';

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
    test('project is deleted and all registrations deleted when the project exists and user does have permissions', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Create().relax({ ...TEST_INITIATIVE, data: { name: 'PNAME' } })).toEqual('Successfully created "PNAME"');
        expect(await new Create().relax({ ...TEST_INITIATIVE, data: { name: 'PROJECT2' }, destination: { toPersonId: 'foo' } })).toEqual('Successfully created "PROJECT2"');
        expect(await REGISTRATION_MODEL.find({}).exec()).toEqual([expect.objectContaining({ projectName: 'PNAME' }), expect.objectContaining({ projectName: 'PROJECT2' })]);
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(2);
        expect((await PROJECT_MODEL.find({}).exec())[0]).toEqual(expect.objectContaining({ name: 'PNAME' }));
        expect((await PROJECT_MODEL.find({}).exec())[1]).toEqual(expect.objectContaining({ name: 'PROJECT2' }));
        expect(await new Delete().relax({ ...TEST_INITIATIVE, data: { name: 'project2' } })).toEqual('Successfully deleted "PROJECT2"');
        expect(await PROJECT_MODEL.find({}).exec()).toEqual([expect.objectContaining({ name: 'PNAME' })]);
        expect(await REGISTRATION_MODEL.find({}).exec()).toEqual([expect.objectContaining({ projectName: 'PNAME' })]);
    });
    test('project is deleted and all registrations deleted when the project exists and user does have permissions case insensitive', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        await CREATE_PROJECT({ name: 'project2' });
        await CREATE_PROJECT();
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(2);
        expect(await new Delete().relax({ ...TEST_INITIATIVE, data: { name: 'pname' } })).toEqual('Successfully deleted "PNAME"');
        expect(await PROJECT_MODEL.find({}).exec()).toEqual([expect.objectContaining({ name: 'project2' })]);
        expect(await REGISTRATION_MODEL.find({}).exec()).toEqual([expect.objectContaining({ projectName: 'project2' })]);
    });
    test('project is not deleted when project exists and user does not have access', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        await CREATE_PROJECT();
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await new Delete().relax({ ...TEST_INITIATIVE, user: { id: 'notAdmin' } })).toEqual('You are not authorized to perform that action. Please ask an administrator.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
    });
});