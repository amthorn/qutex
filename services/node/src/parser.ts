import { Request } from 'express';
import { BOT } from './bot';
import Commands from './commands';
import { LOGGER } from './index';

export class Parser {
    public async parse (request: Request): Promise<IInitiative> {
        const messageId = request.body.data.id;
        let messageData = null;
        if (request.body.resource == 'attachmentActions') {
            messageData = await BOT.attachmentActions.get(messageId);
        } else { // if (request.body.resource == 'messages') {
            messageData = await BOT.messages.get(messageId);
        }

        const person = await BOT.people.get(request.body.data.personId);
        const user = { id: request.body.data.personId, displayName: person.displayName };

        const destination: Destination = {};

        // Email is not sent wfor attachmentActions. Thus use the personId as first
        // priority so that "card" commands and regular text commands will have the same 
        // information parsed and correlated into mongo
        if (messageData.personId) {
            destination.toPersonId = messageData.personId;
        } else if (messageData.personEmail) {
            destination.toPersonEmail = messageData.personEmail;
        } else {
            destination.roomId = messageData.roomId;
        }

        let rawCommand = null;
        let debug = null;

        if (messageData.text) {
            // Response send in text, not as response from a card
            const rawSplit = messageData.text.split('|').map((i: string) => i.trim());
            rawCommand = rawSplit[0];
            const modifiers = rawSplit.splice(1).map((i: string) => i.toLowerCase());
            debug = modifiers.includes('debug');
        } else {
            // Response is from a card
            LOGGER.info('Response is from a card. normalizing...');
            LOGGER.debug(`Before normalization: ${JSON.stringify(messageData.inputs, null, 2)}`);
            rawCommand = this.normalize(messageData.inputs);
            rawCommand.action = messageData.inputs.action;
            LOGGER.debug(`After normalization: ${JSON.stringify(rawCommand, null, 2)}`);
        }

        let commandData: any = {}; //eslint-disable-line @typescript-eslint/no-explicit-any

        // Determine the appropriate action
        for (const command of Commands) {
            const data = await command.check(rawCommand);
            if (data) {
                commandData = {
                    action: command,
                    data: data
                };
                break;
            }
        }
        return {
            rawCommand: rawCommand,
            destination: destination,
            debug: debug,
            user: user,
            data: commandData.data,
            action: commandData.action
        };

    }
    private normalize (data: any): Record<string, string> { //eslint-disable-line @typescript-eslint/no-explicit-any
        const result: Record<string, string> = {};
        for (const key in data._map) {
            result[data._map[key]] = data[key];
        }
        return result;
    }
}