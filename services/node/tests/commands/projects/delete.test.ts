import { Delete } from '../../../src/commands/projects/delete';
import { PROJECT_MODEL } from '../../../src/models/project';
// import * as settings from '../../../src/settings.json';

const TEST_INITIATIVE = {
    data: { name: 'PNAME' },
    rawCommand: 'delete project PNAME',
    destination: { toPersonId: 'notReal' },
    action: new Delete(),
    debug: false,
    user: {
        id: 'fooId',
        displayName: 'foo display name'
    }
};
const TEST_PROJECT: IProject = {
    name: 'PNAME',
    queues: [{ name: 'QNAME', members: [] }],
    admins: [{ id: 'adminId', displayName: 'ANAME' }],
    currentQueue: 'CQNAME'
};

describe('Delete project works appropriately', () => {
    test('project is not deleted when no projects are configured', async () => {
        expect(await new Delete().relax(TEST_INITIATIVE)).toEqual('A project with name "PNAME" does not exist.');
        const projects = await PROJECT_MODEL.find({}).exec();
        expect(projects).toHaveLength(0);
    });
    test('project is deleted when the project exists and user does have permissions', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        await PROJECT_MODEL.build({ ...TEST_PROJECT, ...{ admins: [TEST_INITIATIVE.user] } }).save();
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await new Delete().relax(TEST_INITIATIVE)).toEqual('Successfully deleted "PNAME"');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('project is not deleted when project exists and user does not have access', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        console.log(TEST_PROJECT.admins);
        await PROJECT_MODEL.build(TEST_PROJECT).save();
        console.log(TEST_PROJECT.admins);
        console.log(await PROJECT_MODEL.find({}).exec());
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await new Delete().relax(TEST_INITIATIVE)).toEqual('You are not authorized to perform that action. Please ask an administrator.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
    });
    // test('project is created with default admin', async () => {
    //     expect(await new Create().relax(TEST_PROJECT)).toEqual('Successfully created "foo"');
    //     const projects = await PROJECT_MODEL.find({}).exec();
    //     expect(projects[0].admins).toHaveLength(1);
    //     expect(projects[0].admins[0]).toHaveProperty('id');
    //     expect(projects[0].admins[0]).toHaveProperty('displayName');
    //     expect(projects[0].admins[0].id).toStrictEqual(TEST_PROJECT.user.id);
    //     expect(projects[0].admins[0].displayName).toStrictEqual(TEST_PROJECT.user.displayName);
    // });
    // test('project is not created when project is already configured', async () => {
    //     expect(await new Create().relax(TEST_PROJECT)).toEqual('Successfully created "foo"');
    //     expect(await new Create().relax(TEST_PROJECT)).toEqual('A project with name "foo" already exists.');
    // });
    // test('project is created when a project is already configured, but no conflict', async () => {
    //     expect(await new Create().relax(TEST_PROJECT)).toEqual('Successfully created "foo"');
    //     const newProject = TEST_PROJECT;
    //     newProject.data.name = 'new project name';
    //     expect(await new Create().relax(newProject)).toEqual('Successfully created "new project name"');
    // });
});