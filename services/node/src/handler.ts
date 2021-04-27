import { Request } from 'express';
import { Parser } from './parser';
import { BOT } from './bot';
import * as projectCard from './cards/project.json';

export class Handler {
    private readonly parser: Parser;

    public constructor () {
        this.parser = new Parser();
    }

    public async handle (request: Request): Promise<void> {
        const me = await BOT.people.get('me');
        // Don't do anything if the bot is receiving a hook from its own message.
        if (me.id !== request.body.data.personId) {
            const initiative = await this.parse(request);
            if (initiative.action) {
                const result = await initiative.action.relax(initiative);
                return await BOT.messages.create(Object.assign({ markdown: result }, initiative.destination));
            } else {
                // return await BOT.messages.create(Object.assign({ markdown: 'Command not recognized' }, initiative.destination));

                return await BOT.messages.create(Object.assign(projectCard, initiative.destination));
            }
        }
    }

    private async parse (request: Request): Promise<Initiative> {
        return await this.parser.parse(request);
    }
}