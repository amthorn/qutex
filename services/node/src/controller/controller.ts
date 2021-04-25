import Commands from '../commands';
import { Bot } from '../bot';
export class Controller extends Bot {
    public async relax (initiative: Initiative): Promise<void> {
        for (const command of Commands) {
            if (command.check(initiative.rawCommand)) {
                const result = command.relax(initiative);
                return await Bot.bot.messages.create(Object.assign({ markdown: result }, initiative.destination));
            }
        }
    }
}