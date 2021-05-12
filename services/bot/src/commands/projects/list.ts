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
    public readonly AUTHORIZATION: Auth = Auth.NONE;
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
        // Only return a list of projects that the user is an admin for.
        const projects = await PROJECT_MODEL.find({}).exec();
        if (projects.length > 0) {
            const relevantProjects = [];
            for (const project of projects) {
                if (project.admins.map(i => i.id).includes(initiative.user.id) || CommandBase.SUPER_ADMINS.includes(initiative.user.id)) {
                    relevantProjects.push(project);
                }
            }
            if (relevantProjects.length > 0) {
                const collectionString = relevantProjects.map((v, i) => `${i + 1}. ${v.name}`).join('\n');

                return `List of projects are:\n\n${collectionString}`;
            } else {
                return 'You don\'t have access to any projects.';
            }
        } else {
            return 'There are no projects configured.';
        }
    }
}