/**
 * @file This is the base command which contains many of the common utilities that are used across multiple commands.
 * @author Ava Thorn
 */
import { ProjectDocument, PROJECT_MODEL } from '../models/project';
import { PersonDocument, PERSON_MODEL } from '../models/person';
import { REGISTRATION_MODEL } from '../models/registration';
import { LOGGER } from '../logger';
import { Auth } from '../enum';
import { BOT } from '../bot';
import { compareTwoStrings } from 'string-similarity';
import moment from 'moment';
import * as settings from '../settings.json';


const MILLISECONDS = 1000;
const QUEUE_SUFFIX = '( (to|on|for|with|from) queue {queue:[\\w\\s]+})?';

/**
 * This is used for managing the argument for the removeFromQueue function's "user" argument.
 */
interface IRemoveFromQueueUser {
    id: string;
    displayName: string;
}
export abstract class CommandBase {

    /**
     * This is the string which does not include arguments.
     *
     * @access public
     * @readonly
     */
    public COMMAND_BASE?: string;

    /**
     * This property should determine what kind of command this is.
     * Possible commands are listed by the enum type CommandType.
     *
     * @access public
     * @readonly
     */
    public COMMAND_TYPE?: CommandType;

    /**
     * This string is what is used to store arguments for the command string.
     *
     * @access public
     * @readonly
     */
    public ARGS?: string;

    /**
     * This is a short description of the command which is displayed in the help card.
     *
     * @access public
     * @readonly
     */
    public DESCRIPTION?: string;

    /**
     * This defines whether or not the command permits the queue suffix.
     *
     * @access public
     * @readonly
     */
    public QUEUE = false;

    /**
     * Gets the command that contains the arguments.
     *
     * @access public
     * @returns The string command which contains arguments.
     */
    public get commandWithArgs (): string {
        let tempCommand = this.ARGS ? [this.command, this.ARGS].join(' ') : this.command;
        tempCommand = this.QUEUE ? tempCommand + QUEUE_SUFFIX : tempCommand;
        return tempCommand.trim();
    }

    /**
     * Gets the command that does not contain the arguments.
     *
     * @access public
     * @returns The command that does not contain the arguments.
     */
    public get command (): string {
        switch (this.COMMAND_TYPE) {
            case CommandType.CREATE:
            case CommandType.LIST:
                return `${this.COMMAND_TYPE} ${this.COMMAND_BASE}`;
            case CommandType.DELETE:
                return `(delete|remove) ${this.COMMAND_BASE}`;
            case CommandType.GET:
                return `(get|show) ${this.COMMAND_BASE}`;
            default:
                // Do nothing
                return this.COMMAND_BASE ?? '';
        }
    }

    /**
     * Gets a list of super admins from the env variables.
     *
     * @access public
     * @static
     * @returns A string list of super admins.
     */
    public static get SUPER_ADMINS (): string[] {
        return JSON.parse(process.env.SUPER_ADMINS || '[]');
    }

    /**
     * Returns the registered or named project for the given initiative context.
     *
     * @param initiative - This is the initiative for which to get the registered or named project.
     * @todo Throw errors instead of returning error string.
     * @throws Error when destination is registered to a project that does not exist.
     * @returns Project model or error string for the given initiative context.
     */
    public static async getProject (initiative: IInitiative): Promise<ProjectDocument | string> {
        const registrations = await REGISTRATION_MODEL.find({ destination: initiative.destination }).exec();
        // This is a special case for project delete where a registration is not needed.
        if (initiative.action.COMMAND_BASE === 'project' && initiative.action.COMMAND_TYPE === CommandType.DELETE) {
            const projects = await PROJECT_MODEL.find({ name: initiative.data.name?.toUpperCase() }).exec();
            if (projects.length > 0) {
                return projects[0];
            } else {
                return `A project with name "${initiative.data.name?.toUpperCase()}" does not exist.`;
            }
        } else if (registrations.length > 0) {
            return (await PROJECT_MODEL.find({ name: registrations[0].projectName }).exec())[0];
        } else {
            return 'There are no projects registered.';
        }
    }

    /**
     * Adds the invoking user to the database.
     *
     * @param id - The id for the user to add.
     * @param displayName - The display name for the user to add.
     * @returns The newly created person document.
     * @see PersonDocument
     */
    public static async addUser (id: string, displayName: string): Promise<PersonDocument> {
        LOGGER.verbose('Adding user if they do not exist...');
        const people = await PERSON_MODEL.find({ id: id }).exec();
        if (people.length > 0) {
            // person already exists, do nothing but return
            LOGGER.verbose(`Person '${JSON.stringify(people[0], null, 2)}' already exists.`);
            return people[0];
        } else {
            // Person does not exist; add to database
            LOGGER.verbose(`Person '${displayName}' does not exist; creating...`);
            const result = await PERSON_MODEL.build({
                id: id,
                displayName: displayName,
                inQueueCount: 0,
                inQueueSeconds: 0,
                atHeadSeconds: 0,
                atHeadCount: 0
            }).save();
            // Don't ping bots since they have a tendency to bounce back and forth forever in their DMs
            if ((await BOT.people.get(id)).emails.filter((i: string) => i.endsWith('@webex.bot') || i.endsWith('@sparkbot.io')).length === 0) {
                // A person is being stored in the database for the first time, send them a direct message with
                // information as it relates to the privacy policy
                await BOT.messages.create({
                    toPersonId: id,
                    markdown: settings.PRIVACY_POLICY_MESSAGE.replace('AUTHOR_EMAIL', process.env.AUTHOR_EMAIL || '')
                });
            }
            return result;
        }
    }

    /**
     * Adds a given user to a target queue.
     *
     * @access public
     * @static
     * @param queues - A list of all queues to search through.
     * @param queue - The name of the queue to which to add the user.
     * @param user - The user to add to the queue.
     * @returns The queue that was updated.
     */
    public static addToQueue (queues: IQueue[], queue: string, user: IPerson): IQueue {
        LOGGER.verbose(`Queue Name: ${queue}`);
        LOGGER.verbose(`Queues: ${queues}`);
        const queueObject = queues.filter(i => i.name === queue.toUpperCase())[0];
        const now = new Date();
        const atHeadTime = queueObject.members.length === 0 ? now : null;
        queueObject.members.push({
            person: user,
            enqueuedAt: now,
            atHeadTime: atHeadTime
        });
        queueObject.history.push({
            name: queueObject.name,
            members: queueObject.members,
            time: new Date()
        });
        return queueObject;
    }

    /**
     * Converts the queue into a string by listing it's members in order with timestamps.
     *
     * @access public
     * @static
     * @param queue - The queue to convert into a string.
     * @returns The string; converted to a queue.
     */
    public static queueToString (queue: IQueue): string {
        if (queue.members.length === 0) {
            return `Queue "${queue.name}" is empty`;
        } else {
            const memberList = [];
            for (let i = 0; i < queue.members.length; i++) {
                // EX: April 29, 2021 08:24:40 PM EST
                const formatString = moment(queue.members[i].enqueuedAt).format('LL hh:mm:ss A [EST]');
                memberList.push(`${i + 1}. ${queue.members[i].person.displayName} (${formatString})`);
            }

            return `Queue "${queue.name}":\n\n${memberList.join('\n')}`;
        }
    }

    /**
     * Removes a given user from a target queue.
     *
     * @access public
     * @static
     * @async
     * @param queues - A list of all queues to search through.
     * @param queue - The name of the queue to which to remove the user.
     * @param user - The user to remove from the queue.
     * @param user.id - The user ID for the user to remove from the queue.
     * @param user.displayName - The display name for the user to remove from the queue.
     * @returns The queue that was updated.
     */
    public static async removeFromQueue (queues: IQueue[], queue: string, user: IRemoveFromQueueUser): Promise<IQueue | string> {
        const queueObject = queues.filter(i => i.name === queue)[0];
        const idx = queueObject.members.findIndex(p => p.person.displayName === user.displayName);
        if (idx === -1) {
            return `User "${user.displayName}" was not found in queue "${queueObject.name}"`;
        } else {
            const removed = queueObject.members.splice(idx, 1)[0];
            queueObject.history.push({
                name: queueObject.name,
                members: queueObject.members,
                time: new Date()
            });
            const now = new Date().getTime();

            // If we removed the person at the head of the queue and
            // there are more people in the queue
            if (queueObject.members.length > 0 && idx === 0) {
                const head = queueObject.members[0];
                head.atHeadTime = new Date();
            }
            // Update person object
            const updateData: Record<string, Record<string, number | string>> = { $inc: {} };

            if (removed.atHeadTime) {
                // They were at the head of the queue when they were popped off
                const atHeadSeconds = Math.round((now - removed.atHeadTime.getTime()) / MILLISECONDS);
                LOGGER.verbose(`Increasing 'atHeadSeconds' of '${removed.person.displayName}' by ${atHeadSeconds}`);
                updateData.$inc.atHeadSeconds = atHeadSeconds;
                updateData.$inc.atHeadCount = 1;
            }

            // Calculate normal queue values
            const inQueueSeconds = Math.round((now - removed.enqueuedAt.getTime()) / MILLISECONDS);
            updateData.$inc.inQueueSeconds = inQueueSeconds;
            updateData.$inc.inQueueCount = 1;
            LOGGER.verbose(`Increasing 'inQueueTime' of '${removed.person.displayName}' by ${inQueueSeconds}`);
            LOGGER.verbose(removed.person);

            // Create user if they don't exist
            await this.addUser(user.id, user.displayName);

            LOGGER.verbose(await PERSON_MODEL.find({ id: removed.person.id }).exec());

            await PERSON_MODEL.updateOne({ id: removed.person.id }, updateData).exec();
            return queueObject;
        }
    }

    /**
     * Converts a number of seconds into a time delta string.
     *
     * @param seconds - The number of seconds to convert to a time delta.
     * @returns The string time delta.
     */
    public static getTimeDelta (seconds: number): string {
        const begin = 11;
        const end = 8;
        return new Date(seconds * MILLISECONDS).toISOString().substr(begin, end);
    }

    /**
     * Formula for calculating "how long" until a person reaches the head of the queue is...
     *
     *===========*
     * VARIABLES *
     *===========*
     * Head = The member currently at the head of the queue.
     * TimeElapsed = Time elapsed since the current queue head was put at the head.
     *
     *===========*
     * FUNCTIONS *
     *===========*
     * AvgHeadFlush(N) = Average time to flush member N from the head of the queue.
     * Relax(N) = The current queue except with the current head removed and all the members shifted up one.
     *
     *
     *=========*
     * FORMULA *
     *=========*
     * HowLong(0) = 0                                         --> No one is in the queue. How long is zero.
     * HowLong(1) = MAX(AvgHeadFlush(Head) - TimeElapsed, 0)  --> Only one person is in the queue; subtract time elapsed.
     * HowLong(N) = AvgHeadFlush(N) + HowLong(Relax(N-1))     --> Recursive all other cases.
     *
     * @param queue - The queue to estimate flush time for.
     * @param person - The person for whom to get an estimate of how long it would take for them to be at the head of the queue.
     * @returns A string message for estimated queue time.
     */
    public static async getHowLong (queue: IQueue, person: IPerson | undefined): Promise<string> {
        let idx = queue.members.length;

        if (person) {
            idx = queue.members.findIndex(p => p.person.displayName === person.displayName);
            idx = idx === -1 ? queue.members.length : idx;
        }

        // get subqueue of all members ahead of the person
        const subqueue = queue.members.slice(0, idx);
        if (subqueue.length === 0 && queue.members.length !== 0) {
            return 'You are at the head of the queue so you have no estimated wait time!';
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
                `Your estimated wait time is ${this.getTimeDelta(howLong)}`;
            LOGGER.verbose(msg);
            return msg;
        }
    }

    // Maybe could be fixed if we use this: https://github.com/Microsoft/TypeScript/issues/4890

    /**
     * The authorization guard decorator for the given command object class.
     *
     * @param cls - The command object's class to check authorization for.
     * @returns A class representing the newly decorated class with the guard.
     * @todo Update this to throw an error instead of returning error string.
     */
    public static authorized (cls: any): any { //eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        return class extends cls {
            /**
             * The old relax function which is called from within the guard.
             *
             * @access private
             * @readonly
             */
            private readonly _relax = new cls().relax;
            /**
             * The guard function itself.
             *
             * @param initiative - The initiative from the user to relax.
             * @returns String error or response from command object.
             * @todo Update this to throw an error instead of returning error string.
             */
            public async relax (initiative: IInitiative): Promise<string> {
                LOGGER.debug(`Authorizing: "${initiative.user.id}"`);
                LOGGER.debug(`Authorization Restriction: ${this.AUTHORIZATION}`);
                let isAuthorized = false;

                // Superadmins can do anything
                if (this.AUTHORIZATION === Auth.NONE || cls.SUPER_ADMINS.includes(initiative.user.id)) {
                    // Everyone is authorized
                    isAuthorized = true;
                } else if (this.AUTHORIZATION === Auth.PROJECT_ADMIN) {
                    // get project
                    const project = await CommandBase.getProject(initiative);
                    if (typeof project !== 'string') {
                        LOGGER.debug(`Project Admins: ${project.admins}`);
                        isAuthorized = project.admins.map(i => i.id).includes(initiative.user.id);
                    } else {
                        // If return value is string, then the destination isn't registered
                        return project;
                    }
                }

                if (isAuthorized) {
                    LOGGER.verbose('Authorized');
                    return this._relax(initiative);
                } else {
                    LOGGER.verbose('Unauthorized');
                    // deny by default
                    return 'You are not authorized to perform that action. Please ask an administrator.';
                }

            }
        };
    }

    /**
     * Gets the average amount of time it takes to flush this person from the head of the queue.
     * 
     * @param person - The person whose average wait time you want to get.
     * @returns The average amount of time it takes to flush this person from the queue in seconds.
     */
    private static averageHeadFlush (person: PersonDocument): number {
        return person.atHeadCount === 0 ? person.atHeadCount : person.atHeadSeconds / person.atHeadCount;
    }
    /**
     * Gets the amount of time that the head member has been at head.
     *
     * @param head - The queue member for the head of the queue.
     * @returns The number of seconds for which the head of the queue has been at the head.
     */
    private static timeElapsed (head: IQueueMember): number {
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
    private static howLong (subqueue: PersonDocument[], globalHead: IQueueMember): number {
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

    /**
     * This function should return an object of parse data.
     * The existence of this object should tell the caller
     * whether this command applies to the given string parameter.
     *
     * @param command - The command data to check for a match.
     * @access public
     * @async
     * @returns Truthy or falsey value representing whether the check has
     * succeeded and, if so, the data that was parsed.
     */
    public async check (command: Record<string, string> | string): Promise<[Record<string, string> | boolean | string | null | undefined, number]> {
        LOGGER.debug(`Checking command: ${JSON.stringify(command, null, 2)}`);
        LOGGER.debug(`Checking against regex w/o arguments: ${this.command}`);
        LOGGER.debug(`Checking against regex w/ arguments: ${this.commandWithArgs}`);
        const similarity = compareTwoStrings(typeof command === 'object' ? command.action.toLowerCase() : command.toLowerCase(), this.commandWithArgs);
        LOGGER.debug(`Similarity is: ${similarity}`);
        if (typeof command === 'object' && command.action.toLowerCase().match(new RegExp(`^\\s*${this.command}\\s*$`))) {
            LOGGER.debug(`Match against command w/o arguments: ${this.command}`);
            return [Object.assign({}, command), similarity];
        } else if (typeof command !== 'object') {
            const template = new RegExp(`^\\s*${this.commandWithArgs.replace(/\{(.*?):(.*?)\}/g, '(?<$1>$2)')}\\s*$`);
            const result = command.toLowerCase().match(template);
            if (result !== null) {
                LOGGER.verbose(`Match against command w/ arguments: ${this.commandWithArgs}`);
                LOGGER.verbose(`Match result: ${JSON.stringify(result)}`);
                return [result.groups ? result.groups : true, similarity];
            }
        }
        LOGGER.debug('No match');
        return [null, similarity];
    }

    public abstract relax (initiative: IInitiative): Promise<string>;

    /**
     * Gets the average amount of time it takes to flush this person from the head of the queue.
     *
     * @param person - The person whose average wait time you want to get.
     * @returns The average amount of time it takes to flush this person from the queue in seconds.
     */
}