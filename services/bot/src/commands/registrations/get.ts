import { CommandBase } from '../base';
import { Auth } from '../../enum';

@CommandBase.authorized
export class Get extends CommandBase implements ICommand {
    public static readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.GET;
    public readonly COMMAND_BASE: string = 'registration';
    public readonly DESCRIPTION: string = 'Show the registration for the current room';
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);
        return `This destination is registered to project "${project.name}"`;
    }
}