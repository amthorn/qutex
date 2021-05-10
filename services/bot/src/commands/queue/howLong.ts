/**
 * @file The Command object for the "how long" which gets the amount of time before the first instance
 * of the user gets to the head of the queue.
 * @author Ava Thorn
 */
import { CommandBase } from '../base';
import { Auth } from '../../enum';
import { LOGGER } from '../../logger';
import { PERSON_MODEL, PersonDocument } from '../../models/person';

const MILLISECONDS = 1000;

/**
 * Formula for calculating "how long" until a person reaches the head of the queue is...
 *
 *************
 * VARIABLES *
 *************
 * Head = The member currently at the head of the queue.
 * TimeElapsed = Time elapsed since the current queue head was put at the head.
 *
 *************
 * FUNCTIONS *
 *************
 * AvgHeadFlush(N) = Average time to flush member N from the head of the queue.
 * Relax(N) = The current queue except with the current head removed and all the members shifted up one.
 *
 *
 ***********
 * FORMULA *
 ***********
 * HowLong(0) = 0                                         --> No one is in the queue. How long is zero.
 * HowLong(1) = MAX(AvgHeadFlush(Head) - TimeElapsed, 0)  --> Only one person is in the queue; subtract time elapsed.
 * HowLong(N) = AvgHeadFlush(N) + HowLong(Relax(N-1))     --> Recursive all other cases.
 *
 */
@CommandBase.authorized
export class HowLong extends CommandBase implements ICommand {
    /* eslint-disable jsdoc/require-jsdoc */
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.OPERATION;
    public readonly COMMAND_BASE: string = 'how long';
    public readonly DESCRIPTION: string = 'Get the estimated time remaining until user is at head of queue';
    /* eslint-enable jsdoc/require-jsdoc */

    /**
     * Gets the estimated time remaining until the user is at the head of the queue.
     *
     * @access public
     * @param initiative - The initiative for the operation.
     * @async
     * @returns The response string.
     */
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
            LOGGER.debug(`Person '${JSON.stringify(people[0], null, 2)}' exists.`);
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
            LOGGER.debug(`Queue members are: ${JSON.stringify(members, null, 2)}`);
            // How long can never be negative for any subqueue. The function can spit out negative numbers
            // if the estimated wait time has already elapsed.
            const howLong = Math.max(this.howLong(members, subqueue[0]), 0);
            LOGGER.verbose(`Average wait time: ${howLong}`);

            const phrase = subqueue.length === 1 ? 'is 1 person' : `are ${subqueue.length} people`;

            LOGGER.verbose(`Estimated wait time: ${howLong} seconds`);
            const msg = `Given that there ${phrase} ahead of you. ` +
                `Your estimated wait time is ${CommandBase.getTimeDelta(howLong)}`;
            LOGGER.verbose(msg);
            return msg;
        }
    }

    /**
     * Gets the average amount of time it takes to flush this person from the head of the queue.
     * 
     * @param person - The person whose average wait time you want to get.
     * @returns The average amount of time it takes to flush this person from the queue in seconds.
     */
    private averageHeadFlush (person: PersonDocument): number {
        return person.atHeadCount === 0 ? person.atHeadCount : person.atHeadSeconds / person.atHeadCount;
    }
    /**
     * Gets the amount of time that the head member has been at head.
     *
     * @param head - The queue member for the head of the queue.
     * @returns The number of seconds for which the head of the queue has been at the head.
     */
    private timeElapsed (head: IQueueMember): number {
        const value = (new Date().getTime() - head.enqueuedAt.getTime()) / MILLISECONDS;
        LOGGER.verbose(`Been at head for: ${value}`);
        return value;
    }

    /**
     * Get the estimated amount of time (in seconds) until the subqueue is flushed.
     * How long can come out negative if the estimated queue time has already elapsed.
     *
     * @param subqueue - A list of people in the subqueue.
     * @param globalHead - The current head of the entire queue (not the subqueue).
     * @returns The number of seconds until the subqueue is flushed.
     */
    private howLong (subqueue: PersonDocument[], globalHead: IQueueMember): number {
        if (subqueue.length === 0) {
            LOGGER.verbose('Length: 0 - Time: 0');
            return 0;
        } else if (subqueue.length === 1) {
            const time = this.averageHeadFlush(subqueue[0]) - this.timeElapsed(globalHead);
            LOGGER.verbose(`Length: 1 - Time: ${time}`);
            return time;
        } else {
            const time = this.averageHeadFlush(subqueue[0]) + this.howLong(subqueue.slice(1), globalHead);
            LOGGER.verbose(`Length: ${subqueue.length} - Time: ${time}`);
            return time;
        }
    }
}