/**
 * @file The Command object for the "pun" command which lists returns a fun pun.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { LOGGER } from '../../logger';
import axios from 'axios';

@CommandBase.authorized
export class Pun extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'pun';
    public readonly DESCRIPTION: string = 'Returns a pun:) hehe';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Gets a pun.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        LOGGER.verbose(`Getting pun for user: ${initiative.user.id}`);
        // Only return a list of projects that the user is an admin for.
        const response = await axios({ url: 'https://icanhazdadjoke.com/', headers: { 'Accept': 'text/plain' } });
        LOGGER.info(`Pun: ${JSON.stringify(response.data, null, 2)}`);
        return response.data;
    }
}