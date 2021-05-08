import { CommandBase } from '../base';
import { Auth } from '../../enum';

export class Create extends CommandBase implements ICommand {
    public static readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public readonly COMMAND_TYPE: CommandType = CommandType.CREATE;
    public readonly COMMAND_BASE: string = 'admin';
    public readonly ARGS: string = '{name:[\\w\\s]+}'; // TODO:
    public readonly DESCRIPTION: string = 'Adds a target project admin';
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);
        if (project.admins.includes(initiative.user)) {
            return `"${initiative.user.displayName}" is already an admin.`;
        } else {
            project.admins.push(initiative.user);

            // Save the project
            await project.save();

            // Return response
            return `Successfully added "${initiative.user.displayName}" as an admin.`;
        }
    }
}