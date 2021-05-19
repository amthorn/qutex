/**
 * @file The Command object for the "list admins" command which list admins for the current project.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';


@CommandBase.authorized
export class List extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.LIST;
    public readonly COMMAND_BASE: string = 'admins';
    public readonly DESCRIPTION: string = 'Lists all project admins';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Lists all project admins.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        if (project.admins.length > 0) {
            const collectionString = project.admins.map((v, i) => `${i + 1}. ${v.displayName}`).join('\n');

            return `List of admins are:\n\n${collectionString}`;
        } else {
            // This should never be possible
            return 'There are no admins configured.';
        }
    }
}