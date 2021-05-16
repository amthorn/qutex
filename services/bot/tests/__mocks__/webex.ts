/**
 * @file Contains the mocks for the webex library.
 * @author Ava Thorn
 */

const MOCK_MESSAGE = { text: 'foo', personId: 'fooPersonId' };
const MOCK_PERSON = { id: 'fooId', displayName: 'foo name' };
const MOCK_ATTACHMENT_ACTION = {
    'roomId': 'mockRoomId',
    'roomType': 'group',
    'inputs': {
        'createName': 'Foobar',
        'action': 'create project',
        '_map': {
            'createName': 'name'
        }
    }
};

export default jest.fn().mockImplementation(() => ({
    messages: {
        get: jest.fn(() => MOCK_MESSAGE),
        create: jest.fn()
    },
    people: {
        get: jest.fn(() => MOCK_PERSON)
    },
    attachmentActions: {
        get: jest.fn(() => MOCK_ATTACHMENT_ACTION)
    }
}));
