/**
 * @file The Command object for the "admin" card command which returns a card that can be used for managing
 * Qutex admins for the current project.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { BOT } from '../../bot';
import { Auth } from '../../enum';
import * as projectCard from '../../cards/project.json';

@CommandBase.authorized
export class Card extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.CARD;
    public readonly COMMAND_BASE: string = '^admin(s?)$';
    public readonly DESCRIPTION: string = 'Shows the card relating to Qutex Project Admins';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Shows the card relating to Qutex Project admins.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        await BOT.messages.create({ ...projectCard, ...initiative.destination });
        return '';
    }
}