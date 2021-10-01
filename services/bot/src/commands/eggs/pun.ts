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
        // There's an issue perhaps with the website or the axios library that basically doesn't work properly
        // when the axios is used as the User-Agent. Thus, pretend that we are a curl request.
        const response = await axios({
            url: 'https://icanhazdadjoke.com/',
            headers: { 'Accept': 'text/plain', 'User-Agent': 'curl/7.64.1' }
        });
        LOGGER.info(`Pun: ${JSON.stringify(response.data, null, 2)}`);
        return response.data;
    }
}
