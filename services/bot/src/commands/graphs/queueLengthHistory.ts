/**
 * @file The Command object for the "get queue length history" command which creates a graph of the queue length
 * history.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { LOGGER } from '../../logger';
import { BOT } from '../../bot';
import { QueueLength } from '../../chart';

@CommandBase.authorized
export class Get extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.GET;
    public readonly COMMAND_BASE: string = 'queue length history';
    public readonly DESCRIPTION: string = 'creates a graph of the queue length history';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Creates a graph of the queue length history.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        LOGGER.verbose('Creating graph...');

        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        const queue = project.queues.filter(i => i.name === project.currentQueue)[0];
        if (queue.history.length > 0) {
            const chart = new QueueLength(queue).url;

            LOGGER.verbose(`Chart: ${chart}`);

            await BOT.messages.create({
                ...initiative.destination,
                files: [chart],
                markdown: `Click [here](${chart}) to see your chart in a browser!`
            });

            LOGGER.verbose('Graph created.');

            // Return an empty string so no other webex messages are sent.
            return '';
        } else {
            return 'This queue has no history.';
        }
    }
}