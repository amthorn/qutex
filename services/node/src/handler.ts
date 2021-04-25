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
        return this.bot.people.get('me').then((me: WebexPerson): void => {
            // Don't do anything if the bot is receiving a hook from its own message.
            if (me.id !== request.body.data.personId) {
                this.parse(request).then((initiative: Initiative) => {
                    this.controller.relax(initiative);
                });
            }
        }).catch(() => {
            return;
        });
    }

    private async parse (request: Request): Promise<Initiative> {
        return this.parser.parse(request);
    }
}