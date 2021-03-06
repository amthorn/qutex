/**
 * @file The Command object for the "create queue" command which creates a target queue by name.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { ProjectDocument } from '../../models/project';

@CommandBase.authorized
export class Create extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public readonly COMMAND_TYPE: CommandType = CommandType.CREATE;
    public readonly COMMAND_BASE: string = 'queue';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Creates a target queue';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Creates a queue for the current project.
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

        // make sure a queue with that name doesn't already exist
        if (project.queues.filter(i => i.name === initiative.data.name?.toUpperCase()).length > 0) {
            return `Queue "${initiative.data.name?.toUpperCase()}" already exists.`;
        } else {
            // Add the queue to the project
            // name must exist or command won't match
            project.queues.push({ name: (initiative.data.name as string).toUpperCase(), members: [], history: [] });

            // Save the project
            await project.save();

            // Return response
            return `Created queue "${(initiative.data.name as string).toUpperCase()}" on project "${project.name}" successfully.`;
        }
    }
}