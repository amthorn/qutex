/**
 * @file The Command object for the "list projects" command which lists all projects that exist.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';
import { Auth } from '../../enum';
import { LOGGER } from '../../logger';

@CommandBase.authorized
export class List extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.SUPER_ADMIN;
    public readonly COMMAND_TYPE: CommandType = CommandType.LIST;
    public readonly COMMAND_BASE: string = 'projects';
    public readonly DESCRIPTION: string = 'Lists all available projects';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Lists all available projects.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        LOGGER.verbose(`Listing projects for user: ${initiative.user.id}`);
        const projects = await PROJECT_MODEL.find({}).exec();
        if (projects.length > 0) {
            const collectionString = projects.map((v, i) => `${i + 1}. ${v.name}`).join('\n');

            return `List of projects are:\n\n${collectionString}`;
        } else {
            return 'There are no projects configured.';
        }
    }
}