import { Card } from '../../../src/commands/registrations/card';
import { PROJECT_MODEL } from '../../../src/models/project';
import * as registrationCard from '../../../src/cards/registration.json';
import { BOT } from '../../../src/bot';
import { REGISTRATION_MODEL } from '../../../src/models/registration';

const TEST_INITIATIVE = {
    data: { name: 'foo' },
    rawCommand: 'registration',
    destination: { toPersonId: 'notReal' },
    action: new Card(),
    debug: false,
    user: {
        id: 'fooId',
        displayName: 'foo display name'
    }
};

describe('Show card for registration works appropriately', () => {
    test('card is sent appropriately when card command is issued', async () => {
        // card function doesn't return anything
        expect(await new Card().relax(TEST_INITIATIVE)).toEqual('');
        // doesn't actually do anything like create a project or assign registration, should just return the card
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        expect(await REGISTRATION_MODEL.find({}).exec()).toHaveLength(0);

        expect(BOT.messages.create).toHaveBeenCalledWith({ ...registrationCard, ...TEST_INITIATIVE.destination });
    });
});