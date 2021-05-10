/**
 * @file The Command object for the "remove admin" command which deletes a target admin by name. You must tag the person
 * you want to remove.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { LOGGER } from '../../logger';
import { BOT } from '../../bot';

@CommandBase.authorized
export class Remove extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'remove admin';
    public readonly DESCRIPTION: string = 'Removes a user as a project admin';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Removes a target user as a project admin. The user must be tagged.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        LOGGER.verbose('Removing admin...');
        let msg = '';

        // Get project
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);
        // Check if they were tagged. If not, send error
        if (initiative.mentions.length == 0) {
            return 'No tags found. Please tag a user in order to remove an admin.';
        }

        // Remove admin if they're already an admin
        // Only look at the first one in the list
        const admin = await BOT.people.get(initiative.mentions[0]);
        if (!project.admins.map(i => i.id).includes(admin.id)) {
            msg = `"${admin.displayName}" is not an admin.`;
        } else {
            project.admins = project.admins.filter(i => i.id !== admin.id);

            // Save the project
            await project.save();

            // Return response
            msg = `Successfully removed "${admin.displayName}" as an admin.`;
        }
        LOGGER.verbose(msg);
        return msg;
    }
}