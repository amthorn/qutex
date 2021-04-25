import { CommandBase } from '../base';

export class Get extends CommandBase implements Command {
    public readonly COMMAND_TYPE: CommandType = CommandType.GET;
    public readonly COMMAND: string = 'get status';
    public relax (): string {
        return 'STATUS: Thank you for asking, nobody really asks anymore. ' +
            'I guess I\'m okay, I just have a lot going on, you know? I\'m ' +
            'supposed to be managing all the queues for people and it\'s so ' +
            'hard because I have to be constantly paying attention to everything ' +
            'at all hours of the day, I get no sleep and my social life has plumetted. ' +
            'But I guess I\'m:\n\n200 OK';
    }
}