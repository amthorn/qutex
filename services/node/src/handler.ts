import { Request } from 'express';
import { Parser } from './parser';
import { Controller } from './controller';
import { Bot } from './bot';

export class Handler extends Bot {
    private readonly parser: Parser;
    private readonly controller: Controller;

    public constructor () {
        super();
        this.parser = new Parser();
        this.controller = new Controller();
    }

    public async handle (request: Request): Promise<void> {
        const me = await Bot.bot.people.get('me');
        // Don't do anything if the bot is receiving a hook from its own message.
        if (me.id !== request.body.data.personId) {
            const initiative = await this.parse(request);
            await this.controller.relax(initiative);
        }
    }

    private async parse (request: Request): Promise<Initiative> {
        return await this.parser.parse(request);
    }
}