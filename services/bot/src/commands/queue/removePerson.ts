/**
 * @file The Command object for the "remove person .*" command which removes the user from the current queue.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { BOT } from '../../bot';
import { ProjectDocument } from '../../models/project';

@CommandBase.authorized
export class RemovePerson extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'remove person';
    public readonly ARGS: string = '{name:.+}';
    public readonly DESCRIPTION: string = 'Removes a tagged person from the current queue';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Removes a tagged person from the current queue.
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

        if (initiative.mentions.length > 1) {
            return 'You cannot remove more than one person at once';
        } else if (initiative.mentions.length == 0) {
            return 'You must tag someone to remove from the queue';
        }
        const webexId = initiative.mentions[0];
        const webexPerson = await BOT.people.get(webexId);

        // remove only the first instance
        const queue = await CommandBase.removeFromQueue(project.queues, project.currentQueue, { id: webexId, displayName: webexPerson.displayName });
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
        return `Successfully removed "${webexPerson.displayName}" from queue "${project.currentQueue}".\n\n${CommandBase.queueToString(queue)}${tag ? '\n\n' + tag : ''}`;
    }
}