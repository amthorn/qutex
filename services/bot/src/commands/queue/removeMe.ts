/**
 * @file The Command object for the "remove me" command which removes the user from the current queue, if they exist
 * within that queue.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';

@CommandBase.authorized
export class RemoveMe extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'remove me';
    public readonly QUEUE: boolean = true;
    public readonly DESCRIPTION: string = 'Removes the first occurrence of the user from the current queue';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Removes the user from the current queue.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        let queue = await CommandBase.getQueue(initiative, project);
        if (typeof queue === 'string') return String(queue);

        // remove only the first instance
        queue = await CommandBase.removeFromQueue(queue, { id: initiative.user.id, displayName: initiative.user.displayName });
        if (typeof queue === 'string') return String(queue);

        // Save the project
        await project.save();

        let tag = '';
        if (queue.members.length > 0) {
            const headOfQueue = queue.members[0];
            if (initiative.destination.roomId) {
                tag = `<@personId:${headOfQueue.person.id}|${headOfQueue.person.displayName}>`;
            } else {
                tag = headOfQueue.person.displayName;
            }
            tag += ', you\'re at the front of the queue!';
        }
        // Return response
        return `Successfully removed "${initiative.user.displayName}" from queue "${queue.name}".\n\n${CommandBase.queueToString(queue)}${tag ? '\n\n' + tag : ''}`;
    }
}