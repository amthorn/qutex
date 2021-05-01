import { Request } from 'express';
import { Parser } from './parser';
import { BOT } from './bot';
import { LOGGER } from './logger';

export class Handler {
    private readonly parser: Parser;

    public constructor () {
        this.parser = new Parser();
    }

    public async handle (request: Request): Promise<void> {
        try {
            const me = await BOT.people.get('me');
            // Don't do anything if the bot is receiving a hook from its own message.
            if (me.id !== request.body.data.personId) {
                LOGGER.debug(request.body);
                const initiative = await this.parse(request);
                let result = null;
                if (initiative.action) {
                    result = await initiative.action.relax(initiative);
                } else {
                    result = 'Command not recognized';
                }
                if (result) {
                    await this.handleDebug(initiative, request, result);
                    return await BOT.messages.create({ markdown: result, ...initiative.destination });
                }
            }
        } catch (e) {
            LOGGER.error(e);
            try {
                await BOT.messages.create({
                    markdown: 'An unexpected error occurred. Please open an issue by using the "help" command:\n' + String(e),
                    roomId: request.body.roomId
                });
            } catch (exc) {
                LOGGER.error(exc);
            }
        }
    }
    private async handleDebug (initiative: IInitiative, request: Request, result: string): Promise<void> {
        if (initiative.debug) {
            const debugData = `\`\`\` json\n${JSON.stringify({
                'request': request.body.data,
                'initiative': initiative,
                'result': result
            }, null, 2)}\n\`\`\``;
            return await BOT.messages.create({ markdown: debugData, ...initiative.destination });
        }
    }

    private async parse (request: Request): Promise<IInitiative> {
        return await this.parser.parse(request);
    }
}