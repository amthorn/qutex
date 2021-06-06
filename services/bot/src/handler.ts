/**
 * @file This file is the main controller of qutex. It is responsible for taking the commands from the express routes,
 * sending them to the parser, sending them to the appropriate command object, and returning the message to the user.
 * It is also responsible for global error handling.
 * @author Ava Thorn
 */

import { Request } from 'express';
import { Parser } from './parser';
import { BOT } from './bot';
import { LOGGER } from './logger';
import { INITIATIVE_MODEL } from './models/initiative';
import { v4 } from 'uuid';

export class Handler {
    /**
     * This is the parser object used by the handler for parsing the raw command values into an initiative.
     *
     * @access private
     * @readonly
     */
    private readonly parser: Parser;
    /**
     * Class that is responsible for taking the commands from the express routes, sending them to the parser,
     * sending them to the appropriate command object, and returning the message to the user.
     * It is also responsible for global error handling.
     */
    public constructor () {
        this.parser = new Parser();
    }
    /**
     * Handles the express request from the API to actually perform a function.
     *
     * @async
     * @access public
     * @param request - The express request to handle.
     * @returns Nothing.
     */
    public async handle (request: Request): Promise<void> {
        const me = await BOT.people.get('me');
        // Don't do anything if the bot is receiving a hook from its own message.
        if (me.id !== request.body.data.personId) {
            // This is the earliest we can put this try catch, any earlier
            // and an error will cause a loop which continuously sends messages
            // since the bot will respond to its own messages.
            try {
                LOGGER.debug(request.body);
                const initiative = await this.parser.parse(request);
                let result = null;
                if (initiative.action) {
                    // When the command is invalid, sometimes it cannot be stored in mongo
                    // Thus only dump the initiative to mongo when we know the command was valid.
                    await INITIATIVE_MODEL.build({ ...initiative, time: new Date() }).save();
                    LOGGER.info(`user: ${initiative.user.displayName}`);
                    LOGGER.info(`command: ${initiative.rawCommand}`);
                    LOGGER.info(`action: ${JSON.stringify(initiative.action, null, 2)}`);
                    result = await initiative.action.relax(initiative);
                } else {
                    result = 'Command not recognized. Try using "help" for more information.';
                    if (Object.keys(initiative.similarity.action).length > 0) {
                        result += ` Closest command regex match is: ${initiative.similarity.action}`;
                    }
                }
                if (result) {
                    await this.handleDebug(initiative, request, result);
                    const message = { markdown: result, ...initiative.destination };
                    LOGGER.info(`Sending to: ${JSON.stringify(message, null, 2)}`);
                    return await BOT.messages.create(message);
                }
            } catch (e) {
                const traceId = v4();
                const now = new Date();
                LOGGER.error(`TRACE ID: ${traceId}`);
                LOGGER.error(`OCCURRED AT: ${now}`);
                LOGGER.error(e.stack);
                try {
                    await BOT.messages.create({
                        markdown: `An unexpected error occurred. Please open an issue by using the "help" command:\n${e}`,
                        roomId: request.body.data.roomId
                    });

                    await BOT.messages.create({
                        markdown: `An unexpected error occurred at ${now}.\n\`\`\`\nTRACE ID: ${traceId}\n${e.stack}\n\`\`\``,
                        toPersonEmail: process.env?.DEBUG_EMAIL
                    });
                } catch (exc) {
                    LOGGER.error(exc);
                }
            }
        }

    }
    /**
     * Logs the target initiative in debug mode and sends the debug information back to the user.
     *
     * @async
     * @access private
     * @param initiative - The initiative for which to log for debugging.
     * @param request - The express request for which to log for debugging.
     * @param result - The result of the command object for the given initiative to log for debugging.
     * @returns The response from the webex API.
     */
    private async handleDebug (initiative: IInitiative, request: Request, result: string): Promise<void> {
        const debugData = `\`\`\` json\n${JSON.stringify({
            'request': request.body.data,
            'initiative': initiative,
            'result': result
        }, null, 2)}\n\`\`\``;
        LOGGER.debug(debugData);
        if (initiative.debug) {
            return BOT.messages.create({ markdown: debugData, ...initiative.destination });
        }
    }
}