import { CommandBase } from '../base';
import { BOT } from '../../bot';
import { Auth } from '../../enum';
import * as queuesCard from '../../cards/queues.json';

@CommandBase.authorized
export class Card extends CommandBase implements ICommand {
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.CARD;
    public readonly COMMAND_BASE: string = '^queues$';
    public readonly DESCRIPTION: string = 'Shows the card relating to Qutex Queues';
    public async relax (initiative: IInitiative): Promise<string> {
        // We don't need the project but this should return an appropriate error
        // if a project isn't configured
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        await BOT.messages.create({ ...queuesCard, ...initiative.destination });
        return '';
    }
}