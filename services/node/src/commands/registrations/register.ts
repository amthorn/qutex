import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';
import { Auth } from '../../enum';
import { REGISTRATION_MODEL } from '../../models/registration';

export class Operation extends CommandBase implements ICommand {
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'register to project';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Registers the room to a target project by name';
    public readonly AUTHORIZATION: Auth = Auth.SUPER_ADMIN;
    public async relax (initiative: IInitiative): Promise<string> {
        // Get the project
        const targetProjects = await PROJECT_MODEL.find({ name: initiative.data.name }).exec();
        const existent = await REGISTRATION_MODEL.find({ destination: initiative.destination }).exec();

        if (targetProjects.length === 0) {
            return `Project "${initiative.data.name}" doesn't exist. Create it first and then try to register.`;
        }

        const targetProject = targetProjects[0];

        if (existent.length > 0) {
            const existentRegistration = existent[0];

            // Destination is already registered. handle appropriately
            // TODO: Enable a settings to ask for confirmation or even error outright.
            // Perhaps a "strictError = true" ??
            existentRegistration.projectName = targetProject.name;
            await existentRegistration.save();
            return `This destination is already registered to "${existentRegistration.projectName}". Reregistered to "${targetProject.name}".`;
        } else {
            // destination not registered
            await REGISTRATION_MODEL.build({ destination: initiative.destination, projectName: initiative.data.name }).save();
            return `Successfully registered to "${initiative.data.name}"`;
        }

    }
}