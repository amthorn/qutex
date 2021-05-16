/**
 * @file The Command object for the "registration" card command which returns a card that can be used for managing
 * Qutex registrations.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import * as registrationCard from '../../cards/registration.json';
import { BOT } from '../../bot';
import { Auth } from '../../enum';

@CommandBase.authorized
export class Card extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.CARD;
    public readonly COMMAND_BASE: string = 'registration(s?)';
    public readonly DESCRIPTION: string = 'Shows the card relating to Qutex Registration for your room';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Gets the card for Qutex registrations.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        await BOT.messages.create({ ...registrationCard, ...initiative.destination });
        return '';
    }
}