/**
 * @file The Command object for the "add person .*" command which adds the user to the current queue.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { BOT } from '../../bot';
import { ProjectDocument } from '../../models/project';


@CommandBase.authorized
export class AddPerson extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'add person';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Adds a tagged person to the current queue';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Adds a tagged person to the current queue.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        // Project may not exist if super admin is the invoker
        const project = await CommandBase.getProject(initiative) as ProjectDocument;
        if (typeof project === 'string') return String(project);

        if (initiative.mentions.length > 1) {
            return 'You cannot add more than one person at once';
        } else if (initiative.mentions.length == 0) {
            return 'You must tag someone to add to the queue';
        }
        const webexId = initiative.mentions[0];
        const webexPerson = await BOT.people.get(webexId);

        // Create user if they don't exist
        const user = await CommandBase.addUser(webexId, webexPerson.displayName);

        // Add to end of queue
        const queue = CommandBase.addToQueue(project.queues, project.currentQueue, user);

        // Save the project
        await project.save();

        // Return response
        return `Successfully added "${user.displayName}" to queue "${project.currentQueue}".\n\n${CommandBase.queueToString(queue)}`;
    }
}