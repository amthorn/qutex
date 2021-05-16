/**
 * @file The Command object for the "statistics" card command which returns a card that can be used for creating
 * statistical graphs.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { BOT } from '../../bot';
import { Auth } from '../../enum';
import * as statsCard from '../../cards/statistics.json';

@CommandBase.authorized
export class Card extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.CARD;
    public readonly COMMAND_BASE: string = 'statistics';
    public readonly DESCRIPTION: string = 'Shows the card relating to statistical graphs';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Shows the card relating to statistical graphs.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
    public async relax (initiative: IInitiative): Promise<string> {
        // We don't need the project but this should return an appropriate error
        // if a project isn't configured
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        await BOT.messages.create({ ...statsCard, ...initiative.destination });
        return '';
    }
}