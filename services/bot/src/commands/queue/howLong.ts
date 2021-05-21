/**
 * @file The Command object for the "how long" which gets the amount of time before the first instance
 * of the user gets to the head of the queue.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { LOGGER } from '../../logger';
import { PERSON_MODEL } from '../../models/person';

/**
 * Handles the "How Long" command.
 */
@CommandBase.authorized
export class HowLong extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'how long';
    public readonly QUEUE: boolean = true;
    public readonly DESCRIPTION: string = 'Get the estimated time remaining until user is at head of queue';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Gets the estimated time remaining until the user is at the head of the queue.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        LOGGER.verbose('Getting the user if they exist...');
        const person = (await PERSON_MODEL.find({ id: initiative.user.id }).exec())[0];

        // Get queue
        const queueName = initiative.data.queue?.toUpperCase() || project.currentQueue;
        const queueObject = project.queues.filter(i => i.name === queueName)[0];
        return await CommandBase.getHowLong(queueObject, person);
    }
}