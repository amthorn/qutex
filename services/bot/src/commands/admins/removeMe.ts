import { CommandBase } from '../base';
import { Auth } from '../../enum';

export class RemoveMe extends CommandBase implements ICommand {
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = '^remove me as an admin$';
    public readonly DESCRIPTION: string = 'Removes the user as a project admin';
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        if (project.admins.length === 1) {
            return 'You must have at least one admin configured on the project';
        } else {
            // Remove admin, effectively deleting them from the project
            project.admins = project.admins.filter(i => i.id !== initiative.user.id);

            // Save the project
            await project.save();

            // Return response
            return `Deleted admin "${initiative.user.displayName}" on project "${project.name}" successfully.`;
        }
    }
}