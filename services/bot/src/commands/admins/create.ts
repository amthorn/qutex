import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { LOGGER } from '../../logger';
import { BOT } from '../../bot';

@CommandBase.authorized
export class Create extends CommandBase implements ICommand {
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public readonly COMMAND_TYPE: CommandType = CommandType.CREATE;
    public readonly COMMAND_BASE: string = 'admin';
    public readonly DESCRIPTION: string = 'Adds a target project admin';
    public async relax (initiative: IInitiative): Promise<string> {
        LOGGER.verbose('Creating admin...');
        let msg = '';

        // Get project
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);
        // Check if they were tagged. If not, send error
        if (initiative.mentions.length == 0) {
            return 'No tags found. Please tag a user in order to create an admin.';
        }

        // Create admin if they're not already an admin
        // Only look at the first one in the list
        const admin = await BOT.people.get(initiative.mentions[0]);
        if (project.admins.map(i => i.id).includes(admin.id)) {
            msg = `"${admin.displayName}" is already an admin.`;
        } else {
            project.admins.push({ id: admin.id, displayName: admin.displayName });

            // Save the project
            await project.save();

            // Return response
            msg = `Successfully added "${admin.displayName}" as an admin.`;
        }
        LOGGER.verbose(msg);
        return msg;
    }
}