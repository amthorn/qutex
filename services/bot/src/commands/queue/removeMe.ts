import { CommandBase } from '../base';
import { Auth } from '../../enum';

export class RemoveMe extends CommandBase implements ICommand {
    public static readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'remove me';
    public readonly DESCRIPTION: string = 'Removes the first occurrence of the user from the current queue';
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        // Create user if they don't exist
        const user = await CommandBase.addUser(initiative);

        // remove only the first instance
        const queue = await CommandBase.removeFromQueue(project.queues, project.currentQueue, user);
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
        return `Successfully removed "${user.displayName}" from queue "${project.currentQueue}".\n\n${CommandBase.queueToString(queue)}${tag ? '\n\n' + tag : ''}`;
    }
}