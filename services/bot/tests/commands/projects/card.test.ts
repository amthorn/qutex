import { Card } from '../../../src/commands/projects/card';
import { PROJECT_MODEL } from '../../../src/models/project';
import * as projectCard from '../../../src/cards/project.json';
import { BOT } from '../../../src/bot';

const TEST_INITIATIVE = {
    data: { name: 'foo' },
    rawCommand: 'project',
    destination: { toPersonId: 'notReal' },
    action: new Card(),
    debug: false,
    user: {
        id: 'fooId',
        displayName: 'foo display name'
    }
};

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