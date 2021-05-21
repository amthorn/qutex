/**
 * @file The Command object for the "get largest queue depth" command which gets the largest queue depth and what time
 * it occurred.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { LOGGER } from '../../logger';

@CommandBase.authorized
export class Get extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.GET;
    public readonly COMMAND_BASE: string = 'largest queue depth';
    public readonly QUEUE: boolean = true;
    public readonly DESCRIPTION: string = 'Gets the largest queue depth and at what point that depth was achieved.';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Gets the largest queue depth.
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

        const queue = project.queues.filter(i => i.name === queueName)[0];

        if (queue.history.length > 0) {

            // Get largest queue depth data
            const idx = queue.history.reduce((maxI, el, i, arr) => el.members.length > arr[maxI].members.length ? i : maxI, 0);
            LOGGER.verbose(`Largest Depth index is: ${idx}`);
            const largestDepth = queue.history[idx];

            // Return response
            return `Largest Depth is: ${largestDepth.members.length}\nThis occurred at: ${largestDepth.time}`;
        } else {
            return 'This queue has no history. The largest queue depth is therefore 0.';
        }
    }
}