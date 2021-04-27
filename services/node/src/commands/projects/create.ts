import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';

export class Create extends CommandBase implements Command {
    public readonly COMMAND_TYPE: CommandType = CommandType.CREATE;
    public readonly COMMAND_ACTION: string = 'create project';
    public readonly COMMAND: string = 'create project {name:[\\w\\s]+}';
    public async relax (initiative: Initiative): Promise<string> {
        // Make sure project doesn't exist
        return PROJECT_MODEL.find(initiative.data).then(async (existent) => {
            if (existent.length > 0) {
                return `A project with name "${initiative.data.name}" already exists.`;
            } else {
                const project = PROJECT_MODEL.build(initiative.data);
                const result = await project.save();
                return `Successfully created "${result.name}"`;
            }
        });
    }
}