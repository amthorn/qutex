import { Handler } from '../src/handler';
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

test('handler appropriately checks message contents with no matching command', async () => {
    expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
    expect(Handler.bot.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
});
test('handler appropriately checks message contents and sends response for get status', async () => {
    Handler.bot.messages.get.mockImplementation(() => ({ text: 'get status', personId: 'mockPersonId' }));
    expect(await new Handler().handle(MOCK_REQUEST)).toEqual(undefined);
    expect(Handler.bot.messages.get).toHaveBeenCalledWith(MOCK_REQUEST.body.data.id);
    expect(Handler.bot.messages.create).toHaveBeenCalledWith({
        toPersonId: 'mockPersonId',
        markdown: 'STATUS: Thank you for asking, nobody really asks anymore. I guess I\'m okay, I just have a ' +
            'lot going on, you know? I\'m supposed to be managing all the queues for people and it\'s so hard ' +
            'because I have to be constantly paying attention to everything at all hours of the day, I get ' +
            'no sleep and my social life has plumetted. But I guess I\'m:\n\n200 OK'
    });
});