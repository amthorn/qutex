/**
 * @file Test file for the "pun" command.
 * @author Ava Thorn
 */
import { Pun } from '../../../src/commands/eggs/pun';
import { PROJECT_MODEL } from '../../../src/models/project';
import { TEST_INITIATIVE, STANDARD_USER } from '../../util';
import axios from 'axios';

TEST_INITIATIVE.data = {};
TEST_INITIATIVE.rawCommand = 'pun';
TEST_INITIATIVE.action = new Pun();
TEST_INITIATIVE.user = STANDARD_USER;

describe('Pun works appropriately', () => {
    test('Pun is returned appropriately', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await new Pun().relax(TEST_INITIATIVE)).toEqual('mock response');
        expect(axios).toHaveBeenCalledWith({ url: 'https://icanhazdadjoke.com/', headers: { 'Accept': 'text/plain', 'User-Agent': 'curl/7.64.1' } });
    });
});