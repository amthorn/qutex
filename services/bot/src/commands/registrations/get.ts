/**
 * @file The Command object for the "get registration" command which returns the current registration for the
 * destination from which the command was issued.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';

@CommandBase.authorized
export class Get extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.GET;
    public readonly COMMAND_BASE: string = 'registration';
    public readonly DESCRIPTION: string = 'Show the registration for the current room';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Responsible for getting the registration for the target destination.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);
        return `This destination is registered to project "${project.name}"`;
    }
}