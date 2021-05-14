/**
 * @file Contains the mocks for the chartjs-to-image library.
 * @author Ava Thorn
 */

const MOCK_SHORT_URL = 'myShortUrl';
const MOCK_BINARY_IMAGE = 'myBinaryImage';

export default jest.fn().mockImplementation(() => ({
    getShortUrl: jest.fn(() => MOCK_SHORT_URL),
    toBinary: jest.fn(() => MOCK_BINARY_IMAGE),
    setConfig: jest.fn(() => ({
        setWidth: jest.fn(() => ({
            setHeight: jest.fn()
        }))
    }))
}));
