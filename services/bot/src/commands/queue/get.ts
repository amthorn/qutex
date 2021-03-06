/**
 * @file The Command object for the "get queue" command which returns a list of the members in the current queue.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';

@CommandBase.authorized
export class Get extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.GET;
    public readonly COMMAND_BASE: string = 'queue( {queue:[\\w]+})?';
    public readonly DESCRIPTION: string = 'Gets the current queue and shows the contents of the queue';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Gets the current queue and shows the contents of the queue.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        // Get queue
        const queueName = initiative.data.queue?.toUpperCase() || project.currentQueue;
        const queue = project.queues.filter(i => i.name === queueName);
        if (queue.length > 0) {
            return [CommandBase.queueToString(queue[0]), await CommandBase.getHowLong(queue[0], initiative.user)].join('\n\n');
        } else {
            return `Queue "${queueName}" does not exist. Use 'list queues' to show what queues are available.`;
        }
    }
}