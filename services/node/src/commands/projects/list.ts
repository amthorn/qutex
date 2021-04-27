import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';

export class List extends CommandBase implements Command {
    public readonly COMMAND_TYPE: CommandType = CommandType.LIST;
    public readonly COMMAND_ACTION: string = 'list projects';
    public readonly COMMAND: string = 'list projects';
    public async relax (): Promise<string> {
        const projects = await PROJECT_MODEL.find({}).exec();
        if (projects.length > 0) {
            const projectStr = projects.map((v, i) => `${i + 1}. ${v.name}`).join('\n');

            return `List of projects are:\n\n${projectStr}`;
        } else {
            return 'There are no projects configured.';
        }
    }
}