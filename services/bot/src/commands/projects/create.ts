import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';
import { Auth } from '../../enum';
import * as settings from '../../settings.json';
import { REGISTRATION_MODEL } from '../../models/registration';
import { LOGGER } from '../../logger';

export class Create extends CommandBase implements ICommand {
    public static readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.CREATE;
    public readonly COMMAND_BASE: string = 'project';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Creates a target project';
    public async relax (initiative: IInitiative): Promise<string> {
        LOGGER.verbose('Creating project...');
        // Make sure project doesn't exist
        initiative.data.name = initiative.data.name.toUpperCase();
        return PROJECT_MODEL.find({ name: initiative.data.name }).then(async (existent) => {
            let message = '';
            let level = 'verbose';
            if (existent.length > 0) {
                message = `A project with name "${initiative.data.name}" already exists.`;
                level = 'warn';
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

                message = `Successfully created "${result.name}"`;
            }
            LOGGER.log(level, message);
            return message;
        });
    }
}