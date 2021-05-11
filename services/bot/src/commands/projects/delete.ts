/**
 * @file The Command object for the "delete project" command which deletes a target project by name.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';
import { REGISTRATION_MODEL } from '../../models/registration';
import { Auth } from '../../enum';

@CommandBase.authorized
export class Delete extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.PROJECT_ADMIN;
    public readonly COMMAND_TYPE: CommandType = CommandType.DELETE;
    public readonly COMMAND_BASE: string = 'project';
    public readonly ARGS: string = '{name:[\\w\\s]+}';
    public readonly DESCRIPTION: string = 'Deletes a target project';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Deletes a target project.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        // Will always exist. If it doesn't, the authorizer should thrown a project not found error.
        await PROJECT_MODEL.deleteOne({ name: initiative.data.name.toUpperCase() }).exec();
        // Delete all existing registrations for the project
        await REGISTRATION_MODEL.deleteMany({ projectName: initiative.data.name.toUpperCase() }).exec();
        return `Successfully deleted "${initiative.data.name.toUpperCase()}"`;
    }
}