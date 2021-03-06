/**
 * @file The Command object for the "register to project" command which registers the destination to a project.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';
import { Auth } from '../../enum';
import { REGISTRATION_MODEL } from '../../models/registration';

@CommandBase.authorized
export class Operation extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.SUPER_ADMIN;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'register to project';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Registers the room to a target project by name';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Responsible for registering the project to a target destination.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        initiative.data.name = initiative.data.name?.toUpperCase();
        // Get the project
        const targetProjects = await PROJECT_MODEL.find({ name: initiative.data.name }).exec();
        const existent = await REGISTRATION_MODEL.find({ destination: initiative.destination }).exec();

        if (targetProjects.length === 0) {
            return `Project "${initiative.data.name}" doesn't exist. Create it first and then try to register.`;
        }

        const targetProject = targetProjects[0];

        if (existent.length > 0) {
            const existentRegistration = existent[0];
            let msg = '';

            // Destination is already registered. handle appropriately
            if (existentRegistration.projectName !== targetProject.name) {
                msg = `This destination is already registered to "${existentRegistration.projectName}". Changed registration to "${targetProject.name}"`;
            } else {
                // TODO: Enable a settings to ask for confirmation or even error outright.
                // Perhaps a "strictError = true" ??
                msg = `This destination is already registered to "${existentRegistration.projectName}". Reregistered to "${targetProject.name}".`;
            }
            existentRegistration.projectName = targetProject.name;
            await existentRegistration.save();
            return msg;
        } else {
            // destination not registered
            await REGISTRATION_MODEL.build({ destination: initiative.destination, projectName: initiative.data.name as string }).save();
            return `Successfully registered to "${initiative.data.name}"`;
        }

    }
}