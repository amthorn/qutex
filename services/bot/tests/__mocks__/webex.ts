/**
 * @file Contains the mocks for the webex library.
 * @author Ava Thorn
 */

const MOCK_MESSAGE = { text: 'foo', personId: 'fooPersonId' };
const MOCK_PERSON = { id: 'fooId' };

export default jest.fn().mockImplementation(() => ({
    messages: {
        get: jest.fn(() => MOCK_MESSAGE),
        create: jest.fn()
    },
    people: {
        get: jest.fn(() => MOCK_PERSON)
    }
}));
