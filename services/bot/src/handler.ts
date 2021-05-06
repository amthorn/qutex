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
        const me = await BOT.people.get('me');
        // Don't do anything if the bot is receiving a hook from its own message.
        if (me.id !== request.body.data.personId) {
            // This is the earliest we can put this try catch, any earlier
            // and an error will cause a loop which continuously sends messages
            // since the bot will respond to its own messages.
            try {
                LOGGER.debug(request.body);
                const initiative = await this.parse(request);
                let result = null;
                if (initiative.action) {
                    LOGGER.info(`user: ${initiative.user.displayName}`);
                    LOGGER.info(`command: ${initiative.rawCommand}`);
                    LOGGER.info(`action: ${JSON.stringify(initiative.action, null, 2)}`);
                    result = await initiative.action.relax(initiative);
                } else {
                    result = 'Command not recognized. Try using "help" for more information.';
                }
                if (result) {
                    await this.handleDebug(initiative, request, result);
                    return await BOT.messages.create({ markdown: result, ...initiative.destination });
                }
            } catch (e) {
                LOGGER.error(e.stack);
                try {
                    await BOT.messages.create({
                        markdown: `An unexpected error occurred. Please open an issue by using the "help" command:\n${e}`,
                        roomId: request.body.data.roomId
                    });
                } catch (exc) {
                    LOGGER.error(exc);
                }
            }
        }

    }
    private async handleDebug (initiative: IInitiative, request: Request, result: string): Promise<void> {
        const debugData = `\`\`\` json\n${JSON.stringify({
            'request': request.body.data,
            'initiative': initiative,
            'result': result
        }, null, 2)}\n\`\`\``;
        LOGGER.debug(debugData);
        if (initiative.debug) {
            return await BOT.messages.create({ markdown: debugData, ...initiative.destination });
        }
    }

    private async parse (request: Request): Promise<IInitiative> {
        return await this.parser.parse(request);
    }
}