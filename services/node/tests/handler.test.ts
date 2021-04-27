import { Handler } from '../src/handler';
import { BOT } from '../src/bot';
import { Request } from 'express';

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
            'id': 'Y2lzY29zcGFyazovL3VzL01FU1NBR0UvOTJkYjNiZTAtNDNiZC0xMWU2LThhZTktZGQ1YjNkZmM1NjVk',
            'roomId': 'Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0',
            'personId': 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS9mNWIzNjE4Ny1jOGRkLTQ3MjctOGIyZi1mOWM0NDdmMjkwNDY',
            'personEmail': 'ava@example.com',
            'created': '2015-10-18T14:26:16.000Z'
        }
    }
} as Request;

describe('Handler is working', () => {
    test('handler appropriately checks message contents with no matching command', async () => {
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
    });
    test('handler appropriately does nothing when message originator is the bot', async () => {
        BOT.people.get.mockImplementationOnce(() => ({ id: MOCK_REQUEST.body.data.personId }));
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledTimes(0);
        expect(BOT.messages.create).toHaveBeenCalledTimes(0);
    });

    test('handler appropriately returns response if command is invalid', async () => {
        BOT.messages.get.mockImplementationOnce(() => ({ text: 'invalid foo command', personId: 'mockPersonId' }));
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            toPersonId: 'mockPersonId',
            markdown: 'Command not recognized'
        });
    });

    test('handler appropriately checks message contents and sends response for get status using person ID', async () => {
        BOT.messages.get.mockImplementationOnce(() => ({ text: 'get status', personId: 'mockPersonId' }));
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
    test('handler appropriately checks message contents and sends response for get status using person email', async () => {
        BOT.messages.get.mockImplementationOnce(() => ({ text: 'get status', personEmail: 'mockPersonEmail' }));
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
        BOT.messages.get.mockImplementationOnce(() => ({ text: 'get status', roomId: 'mockRoomId' }));
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
        BOT.messages.get.mockImplementationOnce(() => ({ text: 'create project foobar', roomId: 'mockRoomId' }));
        expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
        expect(BOT.people.get).toHaveBeenCalledWith('me');
        expect(BOT.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
        expect(BOT.messages.create).toHaveBeenCalledWith({
            roomId: 'mockRoomId',
            markdown: 'Successfully created "foobar"'
        });
    });
});