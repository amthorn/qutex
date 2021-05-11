/**
 * @file Test file for the "project" card command.
 * @author Ava Thorn
 */
import { Card } from '../../../src/commands/projects/card';
import { PROJECT_MODEL } from '../../../src/models/project';
import * as projectCard from '../../../src/cards/project.json';
import { BOT } from '../../../src/bot';
import { TEST_INITIATIVE } from '../../util';

TEST_INITIATIVE.data = {};
TEST_INITIATIVE.rawCommand = 'project';
TEST_INITIATIVE.action = new Card();

describe('Show card for projects works appropriately', () => {
    test('card is sent appropriately when card command is issued', async () => {
        // card function doesn't return anything
        expect(await new Card().relax(TEST_INITIATIVE)).toEqual('');
        // doesn't actually do anything like create a project, should just return the card
        const projects = await PROJECT_MODEL.find({}).exec();
        expect(projects).toHaveLength(0);

        expect(BOT.messages.create).toHaveBeenCalledWith({ ...projectCard, ...TEST_INITIATIVE.destination });
    });
});