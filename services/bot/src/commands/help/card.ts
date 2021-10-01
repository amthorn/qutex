/**
 * @file The Command object for the "help" card command which returns a card that details information about qutex
 * as well as information about what commands are available and by what each command is authorized.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { BOT } from '../../bot';
import { Auth } from '../../enum';
import * as helpCard from '../../cards/help.json';
import commands from '..';

@CommandBase.authorized
export class Card extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.CARD;
    public readonly COMMAND_BASE: string = '(get\\s|show\\s)?help';
    public readonly DESCRIPTION: string = 'Shows this card';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Shows the help card.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {

        const cardCommands = commands.filter(i => i.AUTHORIZATION === Auth.NONE).map((i: ICommand) => this.textBlock(i));
        // deep clone to cache bust for testing
        const card = Object.assign({}, helpCard) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        card.attachments[0].content.body[2].actions[0].card.body = cardCommands;
        const projectAdminCommands = commands.filter(i => i.AUTHORIZATION === Auth.PROJECT_ADMIN).map((i: ICommand) => this.textBlock(i));
        card.attachments[0].content.body[2].actions[1].card.body = projectAdminCommands;
        const superAdminCommands = commands.filter(i => i.AUTHORIZATION === Auth.SUPER_ADMIN).map((i: ICommand) => this.textBlock(i));
        card.attachments[0].content.body[2].actions[2].card.body = superAdminCommands;

        // Set "about" information
        card.attachments[0].content.body[1].columns[1].items[0].text = `[${process.env.VERSION}](https://github.com/amthorn/qutex/releases/tag/${process.env.VERSION})`;
        card.attachments[0].content.body[1].columns[1].items[1].text = process.env.RELEASE_DATE;
        card.attachments[0].content.body[1].columns[1].items[2].text = `${process.env.AUTHOR_NAME} (${process.env.AUTHOR_EMAIL})`;

        await BOT.messages.create({ ...card, ...initiative.destination });
        return '';
    }

    /**
     * Generates a textblock given a target command so that the help card looks all nice.
     * 
     * @param command - The command with which to parse the textblock for the card from from.
     * @returns The generated text block.
     */
    public textBlock (command: ICommand): Record<string, boolean | string> {
        return {
            'type': 'TextBlock',
            'text': `\`${command.command}\`\n${command.DESCRIPTION}`,
            'separator': true,
            'wrap': true
        };
    }
}