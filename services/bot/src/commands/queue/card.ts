import { CommandBase } from '../base';
import { BOT } from '../../bot';
import { Auth } from '../../enum';
import * as queueCard from '../../cards/queue.json';

export class Card extends CommandBase implements ICommand {
    public static readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.CARD;
    public readonly COMMAND_BASE: string = '^queue$';
    public readonly DESCRIPTION: string = 'Shows the card relating to Qutex Queues';
    public async relax (initiative: IInitiative): Promise<string> {
        // We don't need the project but this should return an appropriate error
        // if a project isn't configured
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        const card = queueCard as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        card.attachments[0].content.body[0].columns[1].items[1].text = `Queue ${queue.name}`;
        // TODO: put contents of the queue in the show card section

        await BOT.messages.create({ ...queueCard, ...initiative.destination });
        return '';
    }
}