/**
 * @file Test file for the "register to project" command.
 * @author Ava Thorn
 */
import { Operation } from '../../../src/commands/registrations/register';
import { PROJECT_MODEL } from '../../../src/models/project';
import { REGISTRATION_MODEL } from '../../../src/models/registration';
import { CREATE_PROJECT, TEST_INITIATIVE, PROJECT_NAME } from '../../util';

TEST_INITIATIVE.data = { name: PROJECT_NAME };
TEST_INITIATIVE.rawCommand = 'register to project';
TEST_INITIATIVE.action = new Operation();
TEST_INITIATIVE.user.id = 'superAdminId';

describe('Getting registration works appropriately', () => {

    test('errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Operation().relax(TEST_INITIATIVE)).toEqual(
            'Project "PNAME" doesn\'t exist. Create it first and then try to register.'
        );
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('Errors when 1 project exists but try to register to non-existent project', async () => {
        await CREATE_PROJECT({ name: 'foo', registration: false });
        expect(await new Operation().relax(TEST_INITIATIVE)).toEqual(
            'Project "PNAME" doesn\'t exist. Create it first and then try to register.'
        );
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('ability to register when a project exists and is unregistered', async () => {
        const project = await CREATE_PROJECT({ registration: false });
        expect(await new Operation().relax(TEST_INITIATIVE)).toEqual('Successfully registered to "PNAME"');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({ projectName: project.name }).exec()).toHaveLength(1);
    });
    test('Ability to register if project is already registered to the same project', async () => {
        const project = await CREATE_PROJECT();
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({ projectName: project.name }).exec()).toHaveLength(1);
        expect(await new Operation().relax(TEST_INITIATIVE)).toEqual(
            'This destination is already registered to "PNAME". Reregistered to "PNAME".'
        );
        // nothing should have changed
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({ projectName: project.name }).exec()).toHaveLength(1);
    });
    test('Ability to register if project is already registered to different project', async () => {
        // Verify that the destination is *unregistered*
        const project = await CREATE_PROJECT();
        const project2 = await CREATE_PROJECT({ name: 'FOO', registration: false });
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(2);
        expect(await REGISTRATION_MODEL.find({ projectName: project.name }).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(1);

        expect(await new Operation().relax({ ...TEST_INITIATIVE, data: { name: 'foo' } })).toEqual(
            'This destination is already registered to "PNAME". Changed registration to "FOO"'
        );

        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(2);
        // Should have switched registrations
        expect(await REGISTRATION_MODEL.find({ projectName: project.name }).exec()).toHaveLength(0);
        expect(await REGISTRATION_MODEL.find({ projectName: project2.name }).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(1);
    });
    test('non-admins cannot change registration', async () => {
        const project = await CREATE_PROJECT();
        const project2 = await CREATE_PROJECT({ name: 'FOO', registration: false });
        expect(await REGISTRATION_MODEL.find({ projectName: project.name }).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({ projectName: project2.name }).exec()).toHaveLength(0);
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(1);

        expect(await new Operation().relax({ ...TEST_INITIATIVE, user: { id: 'notAnAdmin' } })).toEqual(
            'You are not authorized to perform that action. Please ask an administrator.'
        );

        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(2);
        // should not have changed
        expect(await REGISTRATION_MODEL.find({ projectName: project.name }).exec()).toHaveLength(1);
        expect(await REGISTRATION_MODEL.find({ projectName: project2.name }).exec()).toHaveLength(0);
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(1);
    });
});