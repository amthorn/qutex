export abstract class CommandBase {
    public readonly COMMAND: string = '';

    public async check (command: string): Promise<any> {
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