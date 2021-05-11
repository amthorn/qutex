/**
 * @file The Command object for the "set current queue to" command which sets the current queue to a different queue
 * on the current project.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';

@CommandBase.authorized
export class SetCurrentQueue extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'set (current )?queue to';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Sets the current queue for a project';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Sets the current queue for a project.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        const targetQueues = project.queues.filter(i => i.name === initiative.data.name.toUpperCase());
        if (targetQueues.length === 0) {
            return `Queue "${initiative.data.name.toUpperCase()}" does not exist on project "${project.name}"`;
        } else if (project.currentQueue === initiative.data.name.toUpperCase()) {
            return `Current queue is already set to "${initiative.data.name.toUpperCase()}"`;
        } else {
            project.currentQueue = targetQueues[0].name;

            // Save the project
            await project.save();

            return `Successfully set "${project.currentQueue}" as current queue.`;
        }

    }
}