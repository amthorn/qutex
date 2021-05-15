/**
 * @file Test file for the "add me" command.
 * @author Ava Thorn
 */
import { AddMe } from '../../../src/commands/queue/addMe';
import { PROJECT_MODEL } from '../../../src/models/project';
import { PERSON_MODEL } from '../../../src/models/person';
import { BOT } from '../../../src/bot';
import * as settings from '../../../src/settings.json';
import MockDate from 'mockdate';
import { CREATE_PROJECT, TEST_INITIATIVE, TEST_PROJECT, STANDARD_USER, STRICT_DATE } from '../../util';

TEST_INITIATIVE.rawCommand = 'add me';
TEST_INITIATIVE.action = new AddMe();

describe('Adding me to a queue works appropriately', () => {
    beforeAll(() => {
        MockDate.set(STRICT_DATE);
    });
    afterAll(() => {
        MockDate.reset();
    });

    test('errors when no projects are configured', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
    });
    test('adds me successfully and validates side effects when project exists', async () => {
        let project = await CREATE_PROJECT();
        let queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(project.admins).toEqual(expect.arrayContaining([expect.objectContaining(TEST_PROJECT.admins[0])]));
        expect(await PERSON_MODEL.find({ id: TEST_INITIATIVE.user.id }).exec()).toHaveLength(0);

        expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual(
            `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)`
        );
        // validate
        const people = await PERSON_MODEL.find({ id: TEST_INITIATIVE.user.id }).exec();
        expect(people).toHaveLength(1);
        expect(BOT.messages.create).toBeCalledWith({
            toPersonId: TEST_INITIATIVE.user.id,
            markdown: settings.PRIVACY_POLICY_MESSAGE.replace('AUTHOR_EMAIL', process.env.AUTHOR_EMAIL || '')
        });
        expect(people[0]).toEqual(expect.objectContaining({
            ...TEST_INITIATIVE.user,
            atHeadCount: 0,
            atHeadSeconds: 0,
            inQueueCount: 0,
            inQueueSeconds: 0
        }));

        // refresh project object
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(1);
        expect(queue.members[0]).toEqual(expect.objectContaining({
            atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
            enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
        }));
        expect(queue.members[0].person).toEqual(expect.objectContaining(TEST_INITIATIVE.user));
    });
    test('adds me successfully to non-default queue and validates side effects when project exists', async () => {
        // TODO: do this when "set queue" tests are written
    });
    test('Can add me when I already exist', async () => {
        let project = await CREATE_PROJECT();
        let queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(0);
        expect(project.admins).toEqual(expect.arrayContaining([expect.objectContaining(TEST_PROJECT.admins[0])]));
        expect(await PERSON_MODEL.find({ id: TEST_INITIATIVE.user.id }).exec()).toHaveLength(0);

        expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual(
            `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)`
        );
        expect(await new AddMe().relax(TEST_INITIATIVE)).toEqual(
            `Successfully added "${STANDARD_USER.displayName}" to queue "DEFAULT".\n\nQueue "DEFAULT":\n\n1. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)\n2. ${STANDARD_USER.displayName} (May 6, 2021 01:43:08 AM EST)`
        );
        // validate
        const people = await PERSON_MODEL.find({ id: TEST_INITIATIVE.user.id }).exec();
        expect(people).toHaveLength(1);
        expect(people[0]).toEqual(expect.objectContaining({
            ...TEST_INITIATIVE.user,
            atHeadCount: 0,
            atHeadSeconds: 0,
            inQueueCount: 0,
            inQueueSeconds: 0
        }));

        // refresh project object
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        expect(queue.members).toHaveLength(2);

        expect(queue.members[0]).toEqual(expect.objectContaining({
            atHeadTime: new Date('2021-05-06T05:43:08.056Z'),
            enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
        }));
        expect(queue.members[0].person).toEqual(expect.objectContaining(TEST_INITIATIVE.user));

        expect(queue.members[1]).toEqual(expect.objectContaining({
            atHeadTime: null,
            enqueuedAt: new Date('2021-05-06T05:43:08.056Z')
        }));
        expect(queue.members[1].person).toEqual(expect.objectContaining(TEST_INITIATIVE.user));


    });
});