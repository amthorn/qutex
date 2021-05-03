import { CommandBase } from '../base';
import { Auth } from '../../enum';

export class SetCurrentQueue extends CommandBase implements ICommand {
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'set (current )?queue to';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Sets the current queue for a project';
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        const targetQueues = project.queues.filter(i => i.name === initiative.data.name.toUpperCase());
        if (targetQueues.length === 0) {
            return `Queue "${initiative.data.name.toUpperCase()}" does not exist on project "${project.name}"`;
        } else if (project.currentQueue === initiative.data.name.toUpperCase()) {
            return `Current queue is already set to "${initiative.data.name.toUpperCase()}"`;
        } else {
            project.currentQueue = targetQueues[0].name;

            // Save the project
            await project.save();

            return `Successfully set "${project.currentQueue}" as current queue`;
        }

    }
}