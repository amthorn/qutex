import commands, { HelpCard } from '../../../src/commands';
import { CommandBase } from '../../../src/commands/base';
import { PROJECT_MODEL } from '../../../src/models/project';
import * as helpCard from '../../../src/cards/help.json';
import { BOT } from '../../../src/bot';
import { Auth } from '../../../src/enum';

const TEST_INITIATIVE = {
    data: {},
    rawCommand: 'help',
    destination: { toPersonId: 'notReal' },
    action: new HelpCard(),
    debug: false,
    user: {
        id: 'fooId',
        displayName: 'foo display name'
    }
};

describe('Show card for help works appropriately', () => {
    test('card is sent appropriately when card command is issued', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        // card function doesn't return anything
        const card = Object.assign({}, helpCard) as any;  // eslint-disable-line @typescript-eslint/no-explicit-any
        expect(await new HelpCard().relax(TEST_INITIATIVE)).toEqual('');

        const textBlock = (command: CommandBase): Record<string, boolean | string> => ({
            'type': 'TextBlock',
            'text': `\`${command.command}\`\n${command.DESCRIPTION}`,
            'separator': true,
            'wrap': true
        });

        const cardCommands = commands.filter(i => i.AUTHORIZATION === Auth.NONE).map((i: CommandBase) => textBlock(i));
        // deep clone to cache bust for testing
        card.attachments[0].content.body[2].actions[0].card.body = cardCommands;
        const projectAdminCommands = commands.filter(i => i.AUTHORIZATION === Auth.PROJECT_ADMIN).map((i: CommandBase) => textBlock(i));
        card.attachments[0].content.body[2].actions[1].card.body = projectAdminCommands;
        const superAdminCommands = commands.filter(i => i.AUTHORIZATION === Auth.SUPER_ADMIN).map((i: CommandBase) => textBlock(i));
        card.attachments[0].content.body[2].actions[2].card.body = superAdminCommands;

        // Set "about" information
        card.attachments[0].content.body[1].columns[1].items[0].text = '99.99.99';
        card.attachments[0].content.body[1].columns[1].items[1].text = 'Today';
        card.attachments[0].content.body[1].columns[1].items[2].text = 'My Author Name (email@email.email)';

        expect(BOT.messages.create).toHaveBeenCalledWith({ ...card, ...TEST_INITIATIVE.destination });
    });
});