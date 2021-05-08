import { ProjectDocument, PROJECT_MODEL } from '../models/project';
import { PersonDocument, PERSON_MODEL } from '../models/person';
import { REGISTRATION_MODEL } from '../models/registration';
import { LOGGER } from '../logger';
import { Auth } from '../enum';
import moment from 'moment';


const MILLISECONDS = 1000;
export abstract class CommandBase {
    public COMMAND_BASE?: string;
    public COMMAND_TYPE?: CommandType;
    public ARGS?: string;
    public DESCRIPTION?: string;

    /**
     * This defines who can run the command
     */
    public AUTHORIZATION?: Auth;

    public get commandWithArgs (): string {
        return this.ARGS ? [this.command, this.ARGS].join(' ') : this.command;
    }
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
    public static get SUPER_ADMINS (): string[] {
        return JSON.parse(process.env.SUPER_ADMINS || '[]');
    }
    public static async getProject (initiative: IInitiative): Promise<ProjectDocument | string> {
        const registrations = await REGISTRATION_MODEL.find({ destination: initiative.destination }).exec();
        if (registrations.length > 0) {
            const project = await PROJECT_MODEL.find({ name: registrations[0].projectName }).exec();
            if (project.length > 0) {
                return project[0];
            } else {
                throw Error('This destination is registered to a project that does not exist.');
            }
        } else {
            return 'There are no projects registered.';
        }
    }
    public static async addUser (initiative: IInitiative): Promise<PersonDocument> {
        LOGGER.verbose('Adding user if they do not exist...');
        const people = await PERSON_MODEL.find({ id: initiative.user.id }).exec();
        if (people.length > 0) {
            // person already exists, do nothing but return
            LOGGER.verbose(`Person '${JSON.stringify(people[0], null, 2)}' already exists.`);
            return people[0];
        } else {
            // Person does not exist; add to database
            LOGGER.verbose(`Person '${initiative.user.displayName}' does not exist; creating...`);
            return await PERSON_MODEL.build({
                ...initiative.user,
                inQueueCount: 0,
                inQueueSeconds: 0,
                atHeadSeconds: 0,
                atHeadCount: 0
            }).save();
        }
    }
    public static addToQueue (queues: IQueue[], queue: string, user: IPerson): IQueue {
        const queueObject = queues.filter(i => i.name === queue)[0];
        const now = new Date();
        const atHeadTime = queueObject.members.length === 0 ? now : null;
        queueObject.members.push({
            person: user,
            enqueuedAt: now,
            atHeadTime: atHeadTime
        });
        return queueObject;
    }
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
    public static async removeFromQueue (queues: IQueue[], queue: string, user: IPerson): Promise<IQueue | string> {
        const queueObject = queues.filter(i => i.name === queue)[0];
        const idx = queueObject.members.findIndex(p => p.person.displayName === user.displayName);
        if (idx === -1) {
            return `User "${user.displayName}" was not found in queue "${queueObject.name}"`;
        } else {
            const removed = queueObject.members.splice(idx, 1)[0];
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
            LOGGER.verbose(await PERSON_MODEL.find({ id: removed.person.id }).exec());

            await PERSON_MODEL.updateOne({ id: removed.person.id }, updateData).exec();
            return queueObject;
        }
    }
    public static async addAdmin (project: ProjectDocument, user: IPerson): Promise<string> {
        if (project.admins.includes(user)) {
            return `"${user.displayName}" is already an admin.`;
        } else {
            project.admins.push(user);

            // Save the project
            await project.save();

            // Return response
            return `Successfully added "${user.displayName}" as an admin.`;
        }
    }
    public static getTimeDelta (seconds: number): string {
        const begin = 11;
        const end = 8;
        return new Date(seconds * MILLISECONDS).toISOString().substr(begin, end);
    }
    // Maybe could be fixed if we use this: https://github.com/Microsoft/TypeScript/issues/4890
    public static authorized (cls: any): any { //eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        return class extends cls {
            private readonly _relax = new cls().relax;
            public async relax (initiative: IInitiative): Promise<string> {
                LOGGER.debug(`Authorizing: "${initiative.user.id}"`);
                LOGGER.debug(`Authorization Restriction: ${cls.AUTHORIZATION}`);
                let isAuthorized = false;

                if (cls.AUTHORIZATION === Auth.NONE) {
                    // Everyone is authorized
                    isAuthorized = true;
                } else if (cls.AUTHORIZATION === Auth.PROJECT_ADMIN) {
                    // get project
                    const project = await CommandBase.getProject(initiative);
                    if (typeof project !== 'string') {
                        LOGGER.debug(`Project Admins: ${project.admins}`);
                        isAuthorized = project.admins.map(i => i.id).includes(initiative.user.id);
                    } else {
                        // If return value is string, then the project wasn't found.
                        return `A project with name "${initiative.data.name}" does not exist.`;
                    }
                } else if (cls.AUTHORIZATION === Auth.SUPER_ADMIN) {
                    isAuthorized = cls.SUPER_ADMINS.includes(initiative.user.id);
                }
                if (isAuthorized) {
                    return await this._relax(initiative);
                } else {
                    // deny by default
                    return 'You are not authorized to perform that action. Please ask an administrator.';
                }

            }
        };
    }

    public async check (command: Record<string, string> | string): Promise<Record<string, string> | boolean | string | null | undefined> {
        LOGGER.debug(`Checking command: ${JSON.stringify(command, null, 2)}`);
        LOGGER.debug(`Checking against regex w/o arguments: ${this.command}`);
        LOGGER.debug(`Checking against regex w/ arguments: ${this.commandWithArgs}`);
        if (typeof command === 'object' && command.action.toLowerCase().match(new RegExp(this.command))) {
            LOGGER.debug(`Match against command w/o arguments: ${this.command}`);
            return Object.assign({}, command);
        } else if (typeof command !== 'object') {
            const template = new RegExp(this.commandWithArgs.replace(/\{(.*?):(.*?)\}/g, '(?<$1>$2)'));
            const result = command.toLowerCase().match(template);
            if (result !== null) {
                LOGGER.verbose(`Match against command w/ arguments: ${this.commandWithArgs}`);
                LOGGER.verbose(`Match result: ${JSON.stringify(result)}`);
                return result.groups ? result.groups : true;
            }
        }
        LOGGER.debug('No match');
        return null;
    }
    public abstract relax (initiative: IInitiative): Promise<string>;
}