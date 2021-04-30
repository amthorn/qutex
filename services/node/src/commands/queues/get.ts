import { CommandBase } from '../base';

export class Get extends CommandBase implements ICommand {
    public readonly COMMAND_TYPE: CommandType = CommandType.GET;
    public readonly COMMAND_BASE: string = 'queue';
    public readonly DESCRIPTION: string = 'Gets the current queue and shows the contents of the queue';
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);
        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        return CommandBase.queueToString(queue);
    }
}