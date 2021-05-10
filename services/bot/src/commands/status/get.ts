/**
 * @file The Command object for the "status" command which returns the status of the bot.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';

@CommandBase.authorized
export class Get extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.GET;
    public readonly COMMAND_BASE: string = 'status';
    public readonly DESCRIPTION: string = 'Get the status for Qutex';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Used for getting the status string.
     *
     * @access public
     * @returns The response string.
     * @async
     */
    public async relax (): Promise<string> {
        return 'STATUS: Thank you for asking, nobody really asks anymore. ' +
            'I guess I\'m okay, I just have a lot going on, you know? I\'m ' +
            'supposed to be managing all the queues for people and it\'s so ' +
            'hard because I have to be constantly paying attention to everything ' +
            'at all hours of the day, I get no sleep and my social life has plumetted. ' +
            'But I guess I\'m:\n\n200 OK';
    }
}