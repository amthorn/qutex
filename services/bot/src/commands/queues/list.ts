/**
 * @file The Command object for the "list queues" command which returns a list of queues for the currently
 * registered project.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { ProjectDocument } from '../../models/project';

@CommandBase.authorized
export class List extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.LIST;
    public readonly COMMAND_BASE: string = 'queues';
    public readonly DESCRIPTION: string = 'Lists all queues on the registered project';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Gets a list of available queues for the project.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        // TODO: throw errors instead of returning strings
        // Project may not exist if super admin is the invoker
        const project = await CommandBase.getProject(initiative) as ProjectDocument;
        if (typeof project === 'string') return String(project);
        const queueString = project.queues.map((v, i) => `${i + 1}. ${v.name}${v.name === project.currentQueue ? ' \\*' : ''}`).join('\n');

        return `List of queues in project "${project.name}" are:\n\n${queueString}\n\n\\* indicates current queue.`;
    }
}