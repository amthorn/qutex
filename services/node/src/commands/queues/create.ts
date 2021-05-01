import { CommandBase } from '../base';
import { Auth } from '../../enum';

export class Create extends CommandBase implements ICommand {
    public readonly COMMAND_TYPE: CommandType = CommandType.CREATE;
    public readonly COMMAND_BASE: string = 'queue';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Creates a target queue';
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        // make sure a queue with that name doesn't already exist
        if (project.queues.filter(i => i.name === initiative.data.name.toUpperCase()).length > 0) {
            return `Queue "${initiative.data.name.toUpperCase()}" already exists.`;
        } else {
            // Add the queue to the project
            project.queues.push({ name: initiative.data.name.toUpperCase(), members: [] });

            // Save the project
            await project.save();

            // Return response
            return `Created queue "${initiative.data.name.toUpperCase()}" on project "${project.name}" successfully.`;
        }
    }
}