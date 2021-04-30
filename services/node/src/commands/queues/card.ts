import { CommandBase } from '../base';
import { BOT } from '../../bot';
import * as queuesCard from '../../cards/queues.json';

export class Card extends CommandBase implements ICommand {
    public readonly COMMAND_TYPE: CommandType = CommandType.CARD;
    public readonly COMMAND_BASE: string = '^queues$';
    public readonly DESCRIPTION: string = 'Shows the card relating to Qutex Queues';
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public async relax (initiative: IInitiative): Promise<string> {
        // We don't need the project but this should return an appropriate error
        // if a project isn't configured
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        await BOT.messages.create(Object.assign(queuesCard, initiative.destination));
        return '';
    }
}