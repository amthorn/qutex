import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';

export class Delete extends CommandBase implements Command {
    public readonly COMMAND_TYPE: CommandType = CommandType.DELETE;
    public readonly COMMAND_ACTION: string = 'delete project';
    public readonly COMMAND: string = 'delete project {name:[\\w\\s]+}';
    public async relax (initiative: Initiative): Promise<string> {
        // Make sure project doesn't exist
        return PROJECT_MODEL.find(initiative.data).then(async (existent) => {
            if (existent.length === 0) {
                return `A project with name "${initiative.data.name}" does not exist.`;
            } else {
                PROJECT_MODEL.deleteOne(initiative.data).exec();
                return `Successfully deleted "${initiative.data.name}"`;
            }
        });
    }
}