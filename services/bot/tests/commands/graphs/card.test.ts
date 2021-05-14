/**
 * @file Test file for the "help" card command.
 * @author Ava Thorn
 */

import { Card } from '../../../src/commands/graphs/card';
import { PROJECT_MODEL } from '../../../src/models/project';
import * as statisticsCard from '../../../src/cards/statistics.json';
import { BOT } from '../../../src/bot';
import { CREATE_PROJECT, TEST_INITIATIVE } from '../../util';


TEST_INITIATIVE.data = {};
TEST_INITIATIVE.rawCommand = 'project';
TEST_INITIATIVE.action = new Card();

describe('Show card for queue works appropriately', () => {
    test('card is sent appropriately when card command is issued', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        await CREATE_PROJECT();
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(1);
        // card function doesn't return anything
        expect(await new Card().relax(TEST_INITIATIVE)).toEqual('');

        expect(BOT.messages.create).toHaveBeenCalledWith({ ...statisticsCard, ...TEST_INITIATIVE.destination });
    });
    test('card is not sent when project doesnt exist', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        // card function doesn't return anything
        expect(await new Card().relax(TEST_INITIATIVE)).toEqual('There are no projects registered.');
        expect(BOT.messages.create).not.toHaveBeenCalled();
    });
});