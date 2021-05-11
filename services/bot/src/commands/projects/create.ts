/**
 * @file The Command object for the "create project" command which deletes a target project by name.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';
import { Auth } from '../../enum';
import * as settings from '../../settings.json';
import { REGISTRATION_MODEL } from '../../models/registration';
import { LOGGER } from '../../logger';

@CommandBase.authorized
export class Create extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.CREATE;
    public readonly COMMAND_BASE: string = 'project';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Creates a target project';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Creates a target project.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        LOGGER.verbose('Creating project...');
        const projectName = initiative.data.name.toUpperCase();
        return PROJECT_MODEL.find({ name: projectName }).then(async (existent) => {
            let message = '';
            let level = 'verbose';
            if (existent.length > 0) {
                message = `A project with name "${projectName}" already exists.`;
                level = 'warn';
            } else {
                // Always create project with one default queue
                const queue = { name: settings.DEFAULT_QUEUE_NAME, members: [] };
                // Always set the only existing queue to the project's current queue
                // Always set the user as the only admin

                const project = PROJECT_MODEL.build({
                    ...initiative.data,
                    name: projectName,
                    queues: [queue],
                    currentQueue: queue.name,
                    admins: [initiative.user]
                } as unknown as IProject);

                // Save the project
                const result = await project.save();

                // Create or update the registration for the newly created project.
                const registrations = await REGISTRATION_MODEL.find({ destination: initiative.destination }).exec();
                LOGGER.verbose(`Found: ${JSON.stringify(registrations, null, 2)}`);
                if (registrations.length > 0) {
                    for (const registration of registrations) {
                        LOGGER.verbose(`Updating: ${JSON.stringify(registration, null, 2)}`);
                        await registration.update({
                            destination: registration.destination,
                            projectName: project.name
                        }).exec();
                    }
                } else {
                    const registration = {
                        destination: initiative.destination,
                        projectName: project.name
                    };
                    LOGGER.verbose(`Adding: ${JSON.stringify(registration, null, 2)}`);
                    await REGISTRATION_MODEL.build(registration).save();
                }

                message = `Successfully created "${result.name}"`;
            }
            LOGGER.log(level, message);
            return message;
        });
    }
}