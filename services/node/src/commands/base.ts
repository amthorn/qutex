export abstract class CommandBase {
    public readonly COMMAND: string = '';
    public readonly COMMAND_ACTION: string = '';

    public async check (command: string | any): Promise<any> {
        if (typeof command === 'object' && this.COMMAND_ACTION === command.action) {
            delete command.action;
            return command;
        } else if (typeof command !== 'object') {
            const template = new RegExp(this.COMMAND.replace(/\{(.*?):(.*?)\}/g, '(?<$1>$2)'));
            const result = command.toLowerCase().match(template);
            if (result !== null) {
                return result.groups ? result.groups : true;
            } else {
                // Should not be reachable
                return null;
            }
        }
    }
}