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
            return await BOT.messages.create({ markdown: debugData, ...initiative.destination });
        }
    }
}