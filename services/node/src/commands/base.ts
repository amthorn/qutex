import { Settings } from '../settings';
export abstract class CommandBase {
    public readonly COMMAND: string = '';

    public check (command: string): boolean {
        const doesMatchCaseFold = !Settings.CASE_SENSITIVE && command.toLowerCase() === this.COMMAND.toLowerCase();
        return command === this.COMMAND || doesMatchCaseFold;
    }
}