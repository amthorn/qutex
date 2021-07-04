/**
 * @file The Command object for the "add me" command which adds the user to the current queue.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';

@CommandBase.authorized
export class AddMe extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'add me';
    public readonly QUEUE: boolean = true;
    public readonly DESCRIPTION: string = 'Adds the user to the current queue';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Adds the user to the current queue.
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
        let queue = await CommandBase.getQueue(initiative, project);
        if (typeof queue === 'string') return String(queue);

        // Create user if they don't exist
        const user = await CommandBase.addUser(initiative.user.id, initiative.user.displayName);

        // Add to end of queue
        queue = CommandBase.addToQueue(queue, user);

        // Save the project
        await project.save();

        // Return response
        return `Successfully added "${user.displayName}" to queue "${queue.name}".\n\n${CommandBase.queueToString(queue)}`;
    }
}