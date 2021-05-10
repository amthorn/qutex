/**
 * @file Test file for the "help" card command.
 * @author Ava Thorn
 */
import commands, { HelpCard } from '../../../src/commands';
import { PROJECT_MODEL } from '../../../src/models/project';
import * as helpCard from '../../../src/cards/help.json';
import { BOT } from '../../../src/bot';
import { Auth } from '../../../src/enum';
import { TEST_INITIATIVE } from '../../util';

const ALL_COMMANDS = 23;
const PUBLIC_COMMANDS = 16;
const PROJECT_ADMIN_COMMANDS = 5;
const SUPER_ADMIN_COMMANDS = 2;
TEST_INITIATIVE.rawCommand = 'help';
TEST_INITIATIVE.action = new HelpCard();

/**
 * Creates a textblock for a given command so the help card is neatly organizing the commands that are
 * available to the different users.
 * 
 * @param command - The command target for the textblock to construct.
 * @returns A textblock for usage in the help card.
 */
const TEXT_BLOCK = (command: ICommand): Record<string, boolean | string> => ({
    'type': 'TextBlock',
    'text': `\`${command.command}\`\n${command.DESCRIPTION}`,
    'separator': true,
    'wrap': true
});
describe('Show card for help works appropriately', () => {
    test('card is sent appropriately when card command is issued', async () => {
        expect(await PROJECT_MODEL.find({}).exec()).toHaveLength(0);
        // card function doesn't return anything
        const card = Object.assign({}, helpCard) as any;  // eslint-disable-line @typescript-eslint/no-explicit-any
        expect(await new HelpCard().relax(TEST_INITIATIVE)).toEqual('');

        const cardCommands = commands.filter(i => i.AUTHORIZATION === Auth.NONE).map((i: ICommand) => TEXT_BLOCK(i));
        // deep clone to cache bust for testing
        card.attachments[0].content.body[2].actions[0].card.body = cardCommands;
        const projectAdminCommands = commands.filter(i => i.AUTHORIZATION === Auth.PROJECT_ADMIN).map((i: ICommand) => TEXT_BLOCK(i));
        card.attachments[0].content.body[2].actions[1].card.body = projectAdminCommands;
        const superAdminCommands = commands.filter(i => i.AUTHORIZATION === Auth.SUPER_ADMIN).map((i: ICommand) => TEXT_BLOCK(i));
        card.attachments[0].content.body[2].actions[2].card.body = superAdminCommands;

        // Set "about" information
        card.attachments[0].content.body[1].columns[1].items[0].text = '99.99.99';
        card.attachments[0].content.body[1].columns[1].items[1].text = 'Today';
        card.attachments[0].content.body[1].columns[1].items[2].text = 'My Author Name (email@email.email)';

        expect(commands).toHaveLength(ALL_COMMANDS);
        expect(cardCommands).toHaveLength(PUBLIC_COMMANDS);
        expect(projectAdminCommands).toHaveLength(PROJECT_ADMIN_COMMANDS);
        expect(superAdminCommands).toHaveLength(SUPER_ADMIN_COMMANDS);
        expect(cardCommands.concat(projectAdminCommands).concat(superAdminCommands)).toHaveLength(commands.length);

        expect(BOT.messages.create).toHaveBeenCalledWith({ ...card, ...TEST_INITIATIVE.destination });
    });
});