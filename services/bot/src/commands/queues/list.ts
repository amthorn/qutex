import { CommandBase } from '../base';
import { Auth } from '../../enum';

@CommandBase.authorized
export class List extends CommandBase implements ICommand {
    public static readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.LIST;
    public readonly COMMAND_BASE: string = 'queues';
    public readonly DESCRIPTION: string = 'Lists all queues on the registered project';
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);
        const queueString = project.queues.map((v, i) => `${i + 1}. ${v.name}${v.name === project.currentQueue ? ' \\*' : ''}`).join('\n');

        return `List of queues in project "${project.name}" are:\n\n${queueString}\n\n\\* indicates current queue.`;
    }
}