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
        const queueObject = project.queues.filter(i => i.name === project.currentQueue)[0];
        let idx = queueObject.members.length;

        if (people.length > 0) {
            const person = people[0];
            // person exists
            LOGGER.verbose(`Person '${JSON.stringify(people[0], null, 2)}' exists.`);
            idx = queueObject.members.findIndex(p => p.person.displayName === person.displayName);
            idx = idx === -1 ? queueObject.members.length : idx;
        }

        // get subqueue of all members ahead of the person
        const subqueue = queueObject.members.slice(0, idx);
        if (subqueue.length === 0 && queueObject.members.length !== 0) {
            return 'You are already at the head of the queue';
        } else {
            const members = [];
            for (const member of subqueue) {
                members.push((await PERSON_MODEL.find({ id: member.person.id }).exec())[0]);
            }
            LOGGER.verbose(`Queue members are: ${JSON.stringify(members, null, 2)}`);
            let howLong = this.calculateWaitTime(members);
            LOGGER.verbose(`Average wait time: ${howLong}`);
            howLong -= subqueue.length > 0 ? this.getBeenHeadFor(subqueue[0]) : 0;

            LOGGER.verbose(`Estimated wait time: ${howLong} seconds`);
            const msg = `Given that there are ${subqueue.length} people ahead of you. ` +
                `Your estimated wait time is ${CommandBase.getTimeDelta(howLong)}`;
            LOGGER.verbose(msg);
            return msg;
        }

    }
    private getAverageWaitTime (person: PersonDocument, head: boolean): number {
        if (head) {
            return person.atHeadCount === 0 ? person.atHeadCount : person.atHeadSeconds / person.atHeadCount;
        } else {
            return person.inQueueCount === 0 ? person.inQueueCount : person.inQueueSeconds / person.inQueueCount;
        }
    }
    /**
     * @param head the queue member for the head of the queue
     * @returns The number of seconds that the head of the queue has been at the head for
     */
    private getBeenHeadFor (head: IQueueMember): number {
        return (new Date().getTime() - head.enqueuedAt.getTime()) / 1000;
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