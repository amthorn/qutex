import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';
import { Auth } from '../../enum';
import * as settings from '../../settings.json';
import { REGISTRATION_MODEL } from '../../models/registration';

export class Create extends CommandBase implements ICommand {
    public readonly COMMAND_TYPE: CommandType = CommandType.CREATE;
    public readonly COMMAND_BASE: string = 'project';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Creates a target project';
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public async relax (initiative: IInitiative): Promise<string> {
        // Make sure project doesn't exist
        return PROJECT_MODEL.find({ name: initiative.data.name }).then(async (existent) => {
            if (existent.length > 0) {
                return `A project with name "${initiative.data.name}" already exists.`;
            } else {
                // Always create project with one default queue
                const queue = { name: settings.DEFAULT_QUEUE_NAME.toUpperCase(), members: [] };
                // Always set the only existing queue to the project's current queue
                // Always set the user as the only admin

                const project = PROJECT_MODEL.build({
                    ...initiative.data,
                    queues: [queue],
                    currentQueue: queue.name,
                    admins: [initiative.user]
                } as unknown as IProject);

                // Save the project
                const result = await project.save();

                // Create registration for the newly created project.
                await REGISTRATION_MODEL.build({
                    destination: initiative.destination,
                    projectName: project.name
                }).save();

                return `Successfully created "${result.name}"`;
            }
        });
    }
}