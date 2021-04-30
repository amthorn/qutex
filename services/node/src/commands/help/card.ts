import { CommandBase } from '../base';
import { BOT } from '../../bot';
import * as helpCard from '../../cards/help.json';
import commands from '../index';

export class Card extends CommandBase implements ICommand {
    public readonly COMMAND_TYPE: CommandType = CommandType.CARD;
    public readonly COMMAND_BASE: string = '^(get\\s|show\\s)?help$';
    public readonly DESCRIPTION: string = 'Shows this card';
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public async relax (initiative: IInitiative): Promise<string> {
        const textBlock = (command: CommandBase): Record<string, boolean | string> => ({
            'type': 'TextBlock',
            'text': `\`${command.command}\`\n${command.DESCRIPTION}`,
            'separator': true,
            'wrap': true
        });

        const cardCommands = commands.filter(i => i.AUTHORIZATION === Auth.NONE).map((i: CommandBase) => textBlock(i));
        const card = helpCard as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        card.attachments[0].content.body[2].actions[0].card.body = cardCommands;
        const projectAdminCommands = commands.filter(i => i.AUTHORIZATION === Auth.PROJECT_ADMIN).map((i: CommandBase) => textBlock(i));
        card.attachments[0].content.body[2].actions[1].card.body = projectAdminCommands;
        const superAdminCommands = commands.filter(i => i.AUTHORIZATION === Auth.SUPER_ADMIN).map((i: CommandBase) => textBlock(i));
        card.attachments[0].content.body[2].actions[2].card.body = superAdminCommands;

        // Set "about" information
        card.attachments[0].content.body[1].columns[1].items[0].text = process.env.VERSION;
        card.attachments[0].content.body[1].columns[1].items[1].text = process.env.RELEASE_DATE;
        card.attachments[0].content.body[1].columns[1].items[2].text = `${process.env.AUTHOR_NAME} (${process.env.AUTHOR_EMAIL})`;

        // TODO: make sure icon shows up correctly (Upload to more public webpage?)
        await BOT.messages.create(Object.assign(helpCard, initiative.destination));
        return '';
    }
}