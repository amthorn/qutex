import { ProjectDocument, PROJECT_MODEL } from '../models/project';
import { PersonDocument, PERSON_MODEL } from '../models/person';
import { REGISTRATION_MODEL } from '../models/registration';
import { LOGGER } from '../index';
import moment from 'moment';
export class CommandBase {
    public COMMAND_BASE?: string;
    public COMMAND_TYPE?: CommandType;
    public ARGS?: string;
    public DESCRIPTION?: string;
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
        const people = await PERSON_MODEL.find({ destination: initiative.destination }).exec();
        if (people.length > 0) {
            // person already exists, do nothing but return
            return people[0];
        } else {
            // Person does not exist; add to database
            return await PERSON_MODEL.build(initiative.user).save();
        }
    }
    public static addToQueue (queues: IQueue[], queue: string, user: IPerson): IQueue {
        const queueObject = queues.filter(i => i.name === queue)[0];
        const atHeadTime = queueObject.members.length === 0 ? new Date() : null;
        queueObject.members.push({
            person: user,
            enqueuedAt: new Date(),
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
    public static removeFromQueue (queues: IQueue[], queue: string, user: IPerson): IQueue | string {
        const queueObject = queues.filter(i => i.name === queue)[0];
        const idx = queueObject.members.findIndex(p => p.person.displayName === user.displayName);
        if (idx === -1) {
            return `User "${user.displayName}" was not found in queue "${queueObject.name}"`;
        } else {
            queueObject.members.splice(idx, 1);
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

    public async check (command: Record<string, string> | string): Promise<Record<string, string> | boolean | string | null | undefined> {
        LOGGER.debug(`Checking command: ${JSON.stringify(command, null, 2)}`);
        LOGGER.debug(`Checking against regex w/o arguments: ${this.command}`);
        LOGGER.debug(`Checking against regex w/ arguments: ${this.commandWithArgs}`);
        if (typeof command === 'object' && command.action.toLowerCase().match(new RegExp(this.command))) {
            LOGGER.debug(`Match against command w/o arguments: ${this.command}`);
            delete command.action;
            return command;
        } else if (typeof command !== 'object') {
            const template = new RegExp(this.commandWithArgs.replace(/\{(.*?):(.*?)\}/g, '(?<$1>$2)'));
            const result = command.toLowerCase().match(template);
            if (result !== null) {
                LOGGER.debug(`Match against command w/ arguments: ${this.commandWithArgs}`);
                LOGGER.debug(`Match result: ${JSON.stringify(result)}`);
                return result.groups ? result.groups : true;
            }
        }
        // should not be reachable
        return null;
    }
    public authorized (project: ProjectDocument, person: IPerson): boolean {
        LOGGER.debug(`Authorizing: "${person.displayName}" with "${project.name}"`);
        LOGGER.debug(`Authorization Restriction: ${this.AUTHORIZATION}`);
        LOGGER.debug(`Project Admins: ${project.admins}`);
        if (this.AUTHORIZATION === Auth.PROJECT_ADMIN) {
            return project.admins.map(i => i.displayName).includes(person.displayName);
        } else if (this.AUTHORIZATION === Auth.SUPER_ADMIN) {
            // TODO:
            return false;
        } else {
            return true;
        }
    }
}