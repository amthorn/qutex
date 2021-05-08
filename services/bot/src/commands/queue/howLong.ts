import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { LOGGER } from '../../logger';
import { PERSON_MODEL, PersonDocument } from '../../models/person';

@CommandBase.authorized
export class HowLong extends CommandBase implements ICommand {
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'how long';
    public readonly DESCRIPTION: string = 'Get the estimated time remaining until user is at head of queue';
    public async relax (initiative: IInitiative): Promise<string> {
        const project = await CommandBase.getProject(initiative);
        if (typeof project === 'string') return String(project);

        LOGGER.verbose('Getting the user if they exist...');
        const people = await PERSON_MODEL.find({ id: initiative.user.id }).exec();
        if (people.length > 0) {
            const person = people[0];
            // person exists
            LOGGER.verbose(`Person '${JSON.stringify(people[0], null, 2)}' exists.`);
            const queueObject = project.queues.filter(i => i.name === project.currentQueue)[0];
            const idx = queueObject.members.findIndex(p => p.person.displayName === person.displayName);
            if (idx === -1) {
                return `User "${person.displayName}" was not found in queue "${queueObject.name}"`;
            } else {
                // get subqueue of all members ahead of the person
                const subqueue = queueObject.members.slice(0, 1);
                const members = [];
                for (const member of subqueue) {
                    members.push((await PERSON_MODEL.find({ id: member.person.id }).exec())[0]);
                }
                const howLong = this.calculateWaitTime(members);

                LOGGER.debug(`Estimated wait time: ${howLong} seconds`);
                const msg = `Given that there are ${subqueue.length} people ahead of you. ` +
                    `Your estimated wait time is ${CommandBase.getTimeDelta(howLong)}`;
                LOGGER.verbose(msg);
                return msg;
            }
        } else {
            // Person does not exist
            const msg = `Person '${initiative.user.displayName}' does not exist so cannot get how long`;
            LOGGER.verbose(msg);
            return msg;
        }
    }
    private getAverageWaitTime (person: PersonDocument, head: boolean): number {
        return head ? person.atHeadSeconds / person.atHeadCount : person.inQueueSeconds / person.inQueueCount;
    }
    private calculateWaitTime (subqueue: PersonDocument[]): number {
        if (subqueue.length === 0) {
            return 0;
        } else {
            const head = subqueue.splice(0, 1)[0];
            let time = this.getAverageWaitTime(head, true);
            if (subqueue.length >= 1) {
                // Remaining members are not head values
                for (const member of subqueue) {
                    time += this.getAverageWaitTime(member, false);
                }
            }
            return time;
        }
    }
}