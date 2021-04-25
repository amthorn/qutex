import { Settings } from '../settings';
export class CommandBase {
    public readonly COMMAND: string | null = null;

    public check (command: string): boolean {
        if (this.COMMAND !== null) {
            const doesMatchCaseFold = !Settings.CASE_SENSITIVE && command.toLowerCase() === this.COMMAND.toLowerCase();
            return command === this.COMMAND || doesMatchCaseFold;
        }
        return false;
    }
}