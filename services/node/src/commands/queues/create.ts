import { CommandBase } from '../base';

export class Create extends CommandBase implements ICommand {
    public readonly COMMAND_TYPE: CommandType = CommandType.CREATE;
    public readonly COMMAND_BASE: string = 'queue';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Creates a target queue';
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        project.queues.push({ name: initiative.data.name.toUpperCase(), members: [] });

        // Save the project
        await project.save();

        // Return response
        return `Created queue "${initiative.data.name.toUpperCase()}" on project "${project.name}" successfully.`;
    }
}