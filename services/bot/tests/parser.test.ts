/**
 * @file Test file for parser.ts.
 * @author Ava Thorn
 */
import { Parser } from '../src/parser';
import { BOT } from '../src/bot';
import { Request } from 'express';
import { ProjectDocument } from '../src/models/project';
import { CREATE_PROJECT, CREATE_QUEUE } from './util';

const MOCK_REQUEST = {
    'body': {
        'id': 'Y2lzY29zcGFyazovL3VzL1dFQkhPT0svZjRlNjA1NjAtNjYwMi00ZmIwLWEyNWEtOTQ5ODgxNjA5NDk3',
        'name': 'New message in "Project Unicorn" room',
        'resource': 'messages',
        'event': 'created',
        'filter': 'roomId=Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0',
        'orgId': 'OTZhYmMyYWEtM2RjYy0xMWU1LWExNTItZmUzNDgxOWNkYzlh',
        'createdBy': 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS9mNWIzNjE4Ny1jOGRkLTQ3MjctOGIyZi1mOWM0NDdmMjkwNDY',
        'appId': 'Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL0MyNzljYjMwYzAyOTE4MGJiNGJkYWViYjA2MWI3OTY1Y2RhMzliNjAyOTdjODUwM2YyNjZhYmY2NmM5OTllYzFm',
        'ownedBy': 'creator',
        'status': 'active',
        'actorId': 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS9mNWIzNjE4Ny1jOGRkLTQ3MjctOGIyZi1mOWM0NDdmMjkwNDY',
        'data': {
            'id': 'dataId',
            'roomId': 'mockRequestRoomId',
            'personId': 'STANDARDNAME',
            'personEmail': 'ava@example.com',
            'created': '2015-10-18T14:26:16.000Z'
        }
    }
} as Request;

const EXPECTED_OUTPUT = {
    'action': undefined,
    'data': undefined,
    'debug': false,
    'destination': {
        'toPersonId': 'fooPersonId'
    },
    'mentions': [],
    'rawCommand': 'foo',
    'user': {
        'displayName': 'foo name',
        'id': 'STANDARDNAME'
    }
};

describe('Parser is working', () => {
    let project: ProjectDocument | undefined = undefined;
    beforeEach(async () => {
        project = await CREATE_PROJECT();
    });
    test('Test command not found', async () => {
        expect(await new Parser().parse(MOCK_REQUEST)).toEqual(expect.objectContaining(EXPECTED_OUTPUT));
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
    });

    describe('get queue', () => {
        test('Test get queue command', async () => {
            BOT.messages.get.mockReturnValueOnce({ text: 'get queue' });
            expect((await new Parser().parse(MOCK_REQUEST)).action).toEqual(expect.objectContaining({
                DESCRIPTION: 'Gets the current queue and shows the contents of the queue'
            }));
            expect(await new Parser().parse(MOCK_REQUEST)).toEqual(expect.objectContaining({ data: undefined }));
        });

        test('Test get queue non-default command', async () => {
            await CREATE_QUEUE(project as ProjectDocument, 'FOOBAR');
            BOT.messages.get.mockReturnValue({ text: 'get queue foobar' });
            const result = await new Parser().parse(MOCK_REQUEST);
            expect(result.action).toEqual(expect.objectContaining({
                DESCRIPTION: 'Gets the current queue and shows the contents of the queue'
            }));
            expect(result).toEqual(expect.objectContaining({ data: { queue: 'foobar' } }));
        });

        test('Test get queue default command', async () => {
            await CREATE_QUEUE(project as ProjectDocument, 'FOOBAR');
            BOT.messages.get.mockReturnValue({ text: 'get queue default' });
            const result = await new Parser().parse(MOCK_REQUEST);
            expect(result.action).toEqual(expect.objectContaining({
                DESCRIPTION: 'Gets the current queue and shows the contents of the queue'
            }));
            expect(result).toEqual(expect.objectContaining({ data: { queue: 'default' } }));
        });
    });

    describe('add person', () => {
        test('Add person no queue specification', async () => {
            BOT.messages.get.mockReturnValue({ text: 'add person FOO', mentionedPeople: ['fooId2'] });
            const result = await new Parser().parse(MOCK_REQUEST);
            expect(result.action).toEqual(expect.objectContaining({
                DESCRIPTION: 'Adds a tagged person to the current queue'
            }));
            expect(result.data).toEqual(expect.objectContaining({ queue: undefined }));
            expect(result.mentions).toEqual(['fooId2']);
        });
        test('Add person with queue specification', async () => {
            await CREATE_QUEUE(project as ProjectDocument, 'FOOBAR');
            BOT.messages.get
                .mockReturnValue({ text: 'add person FOO to queue FOOBAR', mentionedPeople: ['fooId2'] });
            const result = await new Parser().parse(MOCK_REQUEST);
            expect(result.action).toEqual(expect.objectContaining({
                DESCRIPTION: 'Adds a tagged person to the current queue'
            }));
            expect(result.data).toEqual(expect.objectContaining({ name: 'foo', queue: 'foobar' }));
            expect(result.mentions).toEqual(['fooId2']);
        });
    });
    describe('get queue length history', () => {
        test('get queue length history no queue specification', async () => {
            BOT.messages.get.mockReturnValue({ text: 'get queue length history' });
            const result = await new Parser().parse(MOCK_REQUEST);
            expect(result.action).toEqual(expect.objectContaining({
                DESCRIPTION: 'creates a graph of the queue length history'
            }));
            expect(result.data).toEqual({ queue: undefined });
        });
        test('get queue length history with queue specification', async () => {
            BOT.messages.get.mockReturnValue({ text: 'get queue length history for queue FOOBAR' });
            const result = await new Parser().parse(MOCK_REQUEST);
            expect(result.action).toEqual(expect.objectContaining({
                DESCRIPTION: 'creates a graph of the queue length history'
            }));
            expect(result.data).toEqual(expect.objectContaining({ queue: 'foobar' }));
        });
    });
    describe('create admin', () => {
        test('create admin no queue specification', async () => {
            BOT.messages.get.mockReturnValue({ text: 'create admin FOO', mentionedPeople: ['fooId2'] });
            const result = await new Parser().parse(MOCK_REQUEST);
            expect(result.action).toEqual(expect.objectContaining({
                DESCRIPTION: 'Adds a target project admin'
            }));
            expect(result.data).toEqual({ name: 'foo' });
            expect(result.mentions).toEqual(['fooId2']);
        });
        test('create admin with queue specification', async () => {
            await CREATE_QUEUE(project as ProjectDocument, 'FOOBAR');
            BOT.messages.get
                .mockReturnValue({ text: 'create admin FOO on queue FOOBAR', mentionedPeople: ['fooId2'] });
            const result = await new Parser().parse(MOCK_REQUEST);
            // Not a real command
            expect(result.action).toEqual(undefined);
        });
    });
    describe('remove admin', () => {
        test('remove admin no queue specification', async () => {
            BOT.messages.get.mockReturnValue({ text: 'remove admin FOO', mentionedPeople: ['fooId2'] });
            const result = await new Parser().parse(MOCK_REQUEST);
            expect(result.action).toEqual(expect.objectContaining({
                DESCRIPTION: 'Removes a user as a project admin'
            }));
            expect(result.data).toEqual({ name: 'foo' });
            expect(result.mentions).toEqual(['fooId2']);
        });
        test('remove admin with queue specification', async () => {
            await CREATE_QUEUE(project as ProjectDocument, 'FOOBAR');
            BOT.messages.get
                .mockReturnValue({ text: 'remove admin FOO on queue FOOBAR', mentionedPeople: ['fooId2'] });
            const result = await new Parser().parse(MOCK_REQUEST);
            // Not a real command
            expect(result.action).toEqual(undefined);
        });
    });

    describe('help', () => {
        test('Help', async () => {
            BOT.messages.get.mockReturnValue({ text: 'help' });
            const result = await new Parser().parse(MOCK_REQUEST);
            expect(result.action).toEqual(expect.objectContaining({
                DESCRIPTION: 'Shows this card'
            }));
            expect(result.data).toEqual(true);
        });
    });
});