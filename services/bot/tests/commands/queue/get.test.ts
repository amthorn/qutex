/**
 * @file Test file for the "add me" command.
 * @author Ava Thorn
 */
import { AddMe } from '../../../src/commands/queue/addMe';
import { Get } from '../../../src/commands/queue/get';
import { PROJECT_MODEL } from '../../../src/models/project';
import { PERSON_MODEL } from '../../../src/models/person';
import MockDate from 'mockdate';
import { CREATE_PROJECT, TEST_INITIATIVE, TEST_PROJECT, STANDARD_USER, STRICT_DATE } from '../../util';

TEST_INITIATIVE.rawCommand = 'get queue';
TEST_INITIATIVE.action = new Get();

describe('Getting a queue works appropriately', () => {
    beforeAll(() => {
        MockDate.set(STRICT_DATE);
    });
    afterAll(() => {
        MockDate.reset();
    });

    test('errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Get().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('Gets queue successfully when project exists', async () => {
        const project = await CREATE_PROJECT();
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(project.admins).toEqual(expect.arrayContaining([expect.objectContaining(TEST_PROJECT.admins[0])]));
        expect(await PERSON_MODEL.find({ id: TEST_INITIATIVE.user.id }).exec()).toHaveLength(0);

        expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual(
            `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)`
        );
        expect(await new Get().relax(TEST_INITIATIVE)).toEqual(
            `Queue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)`
        );
    });
});