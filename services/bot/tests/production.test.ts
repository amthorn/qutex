/**
 * @file Test file for handler.ts.
 * @author Ava Thorn
 */

// Do setup before imports
process.env.NODE_ENV = 'production';
import mock from 'mock-fs';
mock({
    '/run/secrets/': {
        'token': 'some token',
        'mongoPassword': mock.load('../../secrets/local/mongoPassword')
    },
    'src': mock.load('src'),
    'tests': mock.load('tests'),
    'node_modules': mock.load('node_modules')
});

import { GET } from '../src/secrets';

describe('Working when env is set to production', () => {
    test('Test handler', async () => {
        expect(GET('token')).toEqual('some token');
    });
    afterAll(() => {
        mock.restore();
    });
});