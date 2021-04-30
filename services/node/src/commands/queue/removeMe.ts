import { CommandBase } from '../base';

export class RemoveMe extends CommandBase implements ICommand {
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'remove me';
    public readonly DESCRIPTION: string = 'Removes the first occurrence of the user from the current queue';
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        // Create user if they don't exist
        const user = await CommandBase.addUser(initiative);

        // remove only the first instance
        const queue = CommandBase.removeFromQueue(project.queues, project.currentQueue, user);
        if (typeof queue === 'string') return String(queue);

        // Save the project
        await project.save();

        // Return response
        return `Successfully removed "${user.displayName}" from queue "${project.currentQueue}".\n\n${CommandBase.queueToString(queue)}`;
    }
}