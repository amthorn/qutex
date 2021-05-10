/**
 * @file Test file for the "get registration" command.
 * @author Ava Thorn
 */
import { Get } from '../../../src/commands/registrations/get';
import { PROJECT_MODEL } from '../../../src/models/project';
import { REGISTRATION_MODEL } from '../../../src/models/registration';
import { CREATE_PROJECT, TEST_INITIATIVE } from '../../util';

TEST_INITIATIVE.rawCommand = 'get registration';
TEST_INITIATIVE.action = new Get();

describe('Getting registration works appropriately', () => {

    test('errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Get().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('errors when a project exists but is not registered', async () => {
        const project = await CREATE_PROJECT({ registration: false });
        expect(await new Get().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({ projectName: project.name }).exec()).toHaveLength(0);
    });
    test('shows the project when correctly registered with only one project', async () => {
        const project = await CREATE_PROJECT({ destination: { toPersonId: 'notReal' } });
        expect(await new Get().relax(TEST_INITIATIVE)).toEqual('This destination is registered to project "PNAME"');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({ projectName: project.name }).exec()).toHaveLength(1);
    });
    test('shows the project when correctly registered with two projects', async () => {
        const project = await CREATE_PROJECT();
        await CREATE_PROJECT({ name: 'foo' });
        expect(await new Get().relax(TEST_INITIATIVE)).toEqual('This destination is registered to project "PNAME"');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(2);
        expect(await REGISTRATION_MODEL.find({ projectName: project.name }).exec()).toHaveLength(1);
    });
});