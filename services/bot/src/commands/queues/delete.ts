/**
 * @file The Command object for the "delete queue" command which deletes a target queue by name.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { ProjectDocument } from '../../models/project';

@CommandBase.authorized
export class Delete extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public readonly COMMAND_TYPE: CommandType = CommandType.DELETE;
    public readonly COMMAND_BASE: string = 'queue';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Deletes a target queue';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Deletes a target queue for the registered project.
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
        if (project.queues.filter(i => i.name === initiative.data.name?.toUpperCase()).length === 0) {
            return `Queue "${initiative.data.name?.toUpperCase()}" doesn't exist on project "${project.name}".`;
        } else if (project.queues.length === 1) {
            return 'You must have at least one queue configured on the project.';
        } else if (project.currentQueue === initiative.data.name?.toUpperCase()) {
            return `Queue "${initiative.data.name}" is the current queue. You must change the current queue before you can delete it.`;
        } else {
            // Always convert to uppercase
            const queueName = initiative.data.name?.toUpperCase();

            // Remove queue, effectively deleting it
            project.queues = project.queues.filter(i => i.name !== queueName);

            // Save the project
            await project.save();

            // Return response
            return `Deleted queue "${queueName}" on project "${project.name}" successfully.`;
        }
    }
}