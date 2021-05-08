import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';
import { Auth } from '../../enum';

export class List extends CommandBase implements ICommand {
    public static readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.LIST;
    public readonly COMMAND_BASE: string = 'projects';
    public readonly DESCRIPTION: string = 'Lists all available projects';
    public async relax (): Promise<string> {
        const projects = await PROJECT_MODEL.find({}).exec();
        if (projects.length > 0) {
            const collectionString = projects.map((v, i) => `${i + 1}. ${v.name}`).join('\n');

            return `List of projects are:\n\n${collectionString}`;
        } else {
            return 'There are no projects configured.';
        }
    }
}