/**
 * @file The Command object for the "project" card command which returns a card that can be used for managing
 * Qutex projects.
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
    public readonly COMMAND_BASE: string = '^project(s?)$';
    public readonly DESCRIPTION: string = 'Shows the card relating to Qutex Projects';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Shows the card relating to Qutex Projects.
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