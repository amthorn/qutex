import CommandMap from '../command_map';
import { Bot } from '../bot';
export class Controller extends Bot {
    public async relax (initiative: Initiative): Promise<void> {
        console.log(initiative);
        for (const command of CommandMap) {
            console.log(command);
            if (command.check(initiative.rawCommand)) {
                const result = command.relax(initiative);
                return this.bot.messages.create(Object.assign({ markdown: result }, initiative.destination));

            }
        }
    }
}