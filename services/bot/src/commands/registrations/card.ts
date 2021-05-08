import { CommandBase } from '../base';
import * as registrationCard from '../../cards/registration.json';
import { BOT } from '../../bot';
import { Auth } from '../../enum';

@CommandBase.authorized
export class Card extends CommandBase implements ICommand {
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.CARD;
    public readonly COMMAND_BASE: string = '^registration(s?)$';
    public readonly DESCRIPTION: string = 'Shows the card relating to Qutex Registration for your room';
    public async relax (initiative: IInitiative): Promise<string> {
        await BOT.messages.create({ ...registrationCard, ...initiative.destination });
        return '';
    }
}