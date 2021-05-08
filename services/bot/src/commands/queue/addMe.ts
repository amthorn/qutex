import { CommandBase } from '../base';
import { Auth } from '../../enum';

export class AddMe extends CommandBase implements ICommand {
    public static readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'add me';
    public readonly DESCRIPTION: string = 'Adds the user to the current queue';
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        // Create user if they don't exist
        const user = await CommandBase.addUser(initiative);

        // Add to end of queue
        const queue = CommandBase.addToQueue(project.queues, project.currentQueue, user);

        // Save the project
        await project.save();

        // Return response
        return `Successfully added "${user.displayName}" to queue "${project.currentQueue}".\n\n${CommandBase.queueToString(queue)}`;
    }
}