/**
 * @file Test file for handler.ts.
 * @author Ava Thorn
 */
import { Handler } from '../src/handler';
import { BOT } from '../src/bot';
import { Request } from 'express';
import { PROJECT_MODEL } from '../src/models/project';
import { CREATE_PROJECT, CREATE_QUEUE, STRICT_DATE } from './util';
import MockDate from 'mockdate';

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

const MOCK_ATTACHMENTACTION_REQUEST = {
    'body': {
        'resource': 'attachmentActions',
        'data': {
            'id': 'fooId',
            'type': 'submit',
            'messageId': 'fooMessageId',
            'personId': 'fooPerson',
            'roomId': 'fooRoomId',
            'created': '2021-05-11T06:26:43.644Z'
        }
    }
} as Request;

describe('Handler is working', () => {
    test('handler appropriately checks message contents with no matching command', async () => {
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
    });

    test('handler appropriately does nothing when message originator is the bot', async () => {
        BOT.people.get.mockReturnValueOnce({ id: MOCK_REQUEST.body.data.personId });
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledTimes(0);
        expect(BOT.messages.create).toHaveBeenCalledTimes(0);
    });

    test('handler appropriately returns response if command is invalid', async () => {
        BOT.messages.get.mockReturnValueOnce({ text: 'invalid foo command', personId: 'mockPersonId' });
        BOT.people.get.mockReturnValue({ id: MOCK_REQUEST.body.data.personId, displayName: 'mockDisplayName' });
        BOT.people.get.mockReturnValue({ id: 'whateverId', displayName: 'mockDisplayName' });

        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.people.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.personId);
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            toPersonId: 'mockPersonId',
            markdown: 'Command not recognized. Try using "help" for more information.'
        });
    });

    test('handler appropriately checks message contents and sends response for get status using person ID', async () => {
        BOT.messages.get.mockReturnValueOnce({ text: 'get status', personId: 'mockPersonId' });
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            toPersonId: 'mockPersonId',
            markdown: 'STATUS: Thank you for asking, nobody really asks anymore. I guess I\'m okay, I just have a ' +
                'lot going on, you know? I\'m supposed to be managing all the queues for people and it\'s so hard ' +
                'because I have to be constantly paying attention to everything at all hours of the day, I get ' +
                'no sleep and my social life has plumetted. But I guess I\'m:\n\n200 OK'
        });
    });

    test('handler appropriately checks message contents and fails if not an exact match', async () => {
        BOT.messages.get.mockReturnValueOnce({ text: 'okay get status', personId: 'mockPersonId' });
        BOT.people.get.mockReturnValue({ id: MOCK_REQUEST.body.data.personId, displayName: 'mockDisplayName' });
        BOT.people.get.mockReturnValue({ id: 'whateverId', displayName: 'mockDisplayName' });

        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.people.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.personId);
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            toPersonId: 'mockPersonId',
            markdown: 'Command not recognized. Try using "help" for more information. Closest command regex match is: (get|show) status'
        });
    });
    test('handler appropriately checks message contents and sends response for get status using person email', async () => {
        BOT.messages.get.mockReturnValueOnce({ text: 'get status', personEmail: 'mockPersonEmail' });
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            toPersonEmail: 'mockPersonEmail',
            markdown: 'STATUS: Thank you for asking, nobody really asks anymore. I guess I\'m okay, I just have a ' +
                'lot going on, you know? I\'m supposed to be managing all the queues for people and it\'s so hard ' +
                'because I have to be constantly paying attention to everything at all hours of the day, I get ' +
                'no sleep and my social life has plumetted. But I guess I\'m:\n\n200 OK'
        });
    });

    test('handler appropriately checks message contents and sends response for get status using room ID', async () => {
        BOT.messages.get.mockReturnValueOnce({ text: 'get status', roomId: 'mockRoomId', roomType: 'group' });
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            roomId: 'mockRoomId',
            markdown: 'STATUS: Thank you for asking, nobody really asks anymore. I guess I\'m okay, I just have a ' +
                'lot going on, you know? I\'m supposed to be managing all the queues for people and it\'s so hard ' +
                'because I have to be constantly paying attention to everything at all hours of the day, I get ' +
                'no sleep and my social life has plumetted. But I guess I\'m:\n\n200 OK'
        });
    });

    test('handler appropriately handles the case when data is parsed from command', async () => {
        BOT.messages.get.mockReturnValueOnce({ text: 'create project foobar', roomId: 'mockRoomId', roomType: 'group' });
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            roomId: 'mockRoomId',
            markdown: 'Successfully created "FOOBAR"'
        });
    });

    test('handler appropriately handles queue specification', async () => {
        let project = await CREATE_PROJECT();
        const queue = await CREATE_QUEUE(project, 'FOO');
        expect(queue.members).toHaveLength(0);
        BOT.messages.get.mockReturnValueOnce({ text: 'add me to queue FOO', personId: 'notReal' });
        BOT.people.get.mockReturnValue({ id: MOCK_REQUEST.body.data.personId, displayName: 'mockDisplayName' });
        BOT.people.get.mockReturnValue({ id: 'whateverId', displayName: 'mockDisplayName', emails: ['mockEmail'] });
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        project = (await PROJECT_MODEL.find({ name: project.name }).exec())[0];
        expect(project.queues.filter(i => i.name === project.currentQueue)[0].members).toHaveLength(0);
        expect(project.queues.filter(i => i.name === 'FOO')[0].members).toHaveLength(1);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            toPersonId: 'notReal',
            markdown: 'Successfully added "mockDisplayName" to queue "FOO".\n\nQueue "FOO":\n\n1. mockDisplayName (May 6, 2021 01:43:08 AM EST)'
        });
    });

    test('handler appropriately handles the case when data is parsed from command when there is a mentioned user', async () => {
        BOT.messages.get.mockReturnValueOnce({
            text: 'create project foobar',
            roomId: 'mockRoomId',
            roomType: 'group',
            mentionedPeople: ['mentionedId']
        });
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            roomId: 'mockRoomId',
            markdown: 'Successfully created "FOOBAR"'
        });
    });

    test('handler appropriately handles the case when data is parsed from command and debug is true', async () => {
        BOT.messages.get.mockReturnValueOnce({ text: 'create project foobar | debug', roomId: 'mockRoomId', roomType: 'group' });
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            roomId: 'mockRoomId',
            markdown: 'Successfully created "FOOBAR"'
        });
        expect(BOT.messages.create).toHaveBeenCalledWith({
            roomId: 'mockRoomId',
            markdown: `\`\`\` json\n${JSON.stringify({
                'request': {
                    'id': 'dataId',
                    'roomId': 'mockRequestRoomId',
                    'personId': 'STANDARDNAME',
                    'personEmail': 'ava@example.com',
                    'created': '2015-10-18T14:26:16.000Z'
                },
                'initiative': {
                    'rawCommand': 'create project foobar',
                    'destination': {
                        'roomId': 'mockRoomId'
                    },
                    'debug': true,
                    'user': {
                        'id': 'STANDARDNAME',
                        'displayName': 'mockDisplayName'
                    },
                    'data': {
                        'name': 'foobar'
                    },
                    'action': {
                        'QUEUE': false,
                        'AUTHORIZATION': 'none',
                        'COMMAND_TYPE': 'create',
                        'COMMAND_BASE': 'project',
                        'ARGS': '{name:[\\w\\s]+}',
                        'DESCRIPTION': 'Creates a target project'
                    },
                    'similarity': {
                        'similarity': 0.5454545454545454,
                        'action': 'create project {name:[\\w\\s]+}'
                    },
                    'mentions': []
                },
                'result': 'Successfully created "FOOBAR"'
            }, null, 2)}\n\`\`\``
        });
    });

    test('handler appropriately handles card attachmentActions', async () => {
        expect(await new Handler().handle(MOCK_ATTACHMENTACTION_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.attachmentActions.get).toHaveBeenCalledWith(MOCK_ATTACHMENTACTION_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            roomId: 'mockRoomId',
            markdown: 'Successfully created "FOOBAR"'
        });
    });
});

describe('Handler errors as it should', () => {
    beforeAll(() => {
        MockDate.set(STRICT_DATE);
    });
    afterAll(() => {
        MockDate.reset();
    });
    test('Handler sends a response even in the event of a catastrophic error', async () => {
        BOT.messages.get.mockImplementation(() => {
            throw new Error('THIS IS AN EXPECTED ERROR');
        });
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            roomId: 'mockRequestRoomId',
            markdown: 'An unexpected error occurred. Please open an issue by using the "help" command:\nError: THIS IS AN EXPECTED ERROR'
        });
        expect(BOT.messages.create).toHaveBeenCalledWith({
            toPersonEmail: process.env.DEBUG_EMAIL,
            markdown: expect.stringMatching(`An unexpected error occurred at Thu May 06 2021 01:43:08 GMT-0400 \\(Eastern Daylight Time\\)\\.
\`\`\`
TRACE ID: [\\w\\-]+
Error: THIS IS AN EXPECTED ERROR
    at .*?handler.test.ts:\\d+:\\d+\\)
    at .*?index.js:\\d+:\\d+
    at .*?index.js:\\d+:\\d+\\)
    at .*?index.js:\\d+:\\d+\\)
    at .*?parser.ts:\\d+:\\d+\\)
    at .*?
    at .*?parser.ts:\\d+:\\d+\\)
    at .*?
    at .*?task_queues:\\d+:\\d+\\)
\`\`\``)
        });
    });
    test('Handler doesnt die when catastrophic error occurs during handling of catastrophic error', async () => {
        BOT.messages.get.mockImplementation(() => {
            throw new Error('THIS IS AN EXPECTED ERROR');
        });
        BOT.messages.create.mockImplementation(() => {
            throw new Error('THIS IS AN EXPECTED ERROR THAT HAPPENED DURING HANDLING OF THE OTHER ERROR');
        });
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);

        // This command should error, but will have been called regardless
        expect(BOT.messages.create).toHaveBeenCalledWith({
            roomId: 'mockRequestRoomId',
            markdown: 'An unexpected error occurred. Please open an issue by using the "help" command:\nError: THIS IS AN EXPECTED ERROR'
        });
        expect(BOT.messages.create).toThrowError('THIS IS AN EXPECTED ERROR THAT HAPPENED DURING HANDLING OF THE OTHER ERROR');
    });
});