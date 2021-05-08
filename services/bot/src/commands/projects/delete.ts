import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';
import { Auth } from '../../enum';

@CommandBase.authorized
export class Delete extends CommandBase implements ICommand {
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public readonly COMMAND_TYPE: CommandType = CommandType.DELETE;
    public readonly COMMAND_BASE: string = 'project';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Deletes a target project';
    public async relax (initiative: IInitiative): Promise<string> {
        // Will always exist. If it doesn't, the authorizer should thrown a project not found error.
        await PROJECT_MODEL.deleteOne(initiative.data).exec();
        return `Successfully deleted "${initiative.data.name.toUpperCase()}"`;
    }
}