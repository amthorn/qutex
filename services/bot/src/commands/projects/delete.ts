import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';
import { Auth } from '../../enum';

export class Delete extends CommandBase implements ICommand {
    public readonly COMMAND_TYPE: CommandType = CommandType.DELETE;
    public readonly COMMAND_BASE: string = 'project';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Deletes a target project';
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public async relax (initiative: IInitiative): Promise<string> {
        initiative.data.name = initiative.data.name.toUpperCase();
        // Make sure project doesn't exist
        const existent = await PROJECT_MODEL.find({ name: initiative.data.name }).exec();
        if (existent.length > 0 && this.authorized(existent[0], initiative.user)) {
            await PROJECT_MODEL.deleteOne(initiative.data).exec();
            return `Successfully deleted "${initiative.data.name}"`;
        } else if (existent.length === 0) {
            return `A project with name "${initiative.data.name}" does not exist.`;
        } else {
            return 'You are not authorized to perform that action. Please ask an administrator.';
        }
    }
}