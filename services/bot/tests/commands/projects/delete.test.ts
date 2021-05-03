import { Delete } from '../../../src/commands/projects/delete';
import { PROJECT_MODEL } from '../../../src/models/project';

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
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
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
        await PROJECT_MODEL.build(TEST_PROJECT).save();
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        expect(await new Delete().relax(TEST_INITIATIVE)).toEqual('You are not authorized to perform that action. Please ask an administrator.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
    });
});