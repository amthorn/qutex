import { Request } from 'express';
import { BOT } from './bot';
import Commands from './commands';
import { LOGGER } from './logger';



export class Parser {
    public async parse (request: Request): Promise<IInitiative> {
        // TODO: improve this by pulling out of this function
        // It should only happen once. Here it will be called on every request.
        const me = await BOT.people.get('me');
        const messageId = request.body.data.id;
        let messageData = null;
        if (request.body.resource == 'attachmentActions') {
            messageData = await BOT.attachmentActions.get(messageId);
        } else { // if (request.body.resource == 'messages') {
            messageData = await BOT.messages.get(messageId);
        }
        
        const person = await BOT.people.get(request.body.data.personId);
        const user: Record<string, string> = { id: request.body.data.personId, displayName: person.displayName };

        const destination: Destination = {};
        const mentions: string[] = messageData.mentionedPeople || [];

        // Email is not sent for attachmentActions. Thus, use the personId as first
        // priority so that "card" commands and regular text commands will have the same 
        // information parsed and correlated into mongo

        // Use roomId as first priority so that group chats don't get pinged directly.
        if (messageData.roomType === 'group') {
            destination.roomId = messageData.roomId;
        } else if (messageData.personId) {
            destination.toPersonId = messageData.personId;
        } else if (messageData.personEmail) {
            destination.toPersonEmail = messageData.personEmail;
        }

        let rawCommand = null;
        let debug = null;

        if (messageData.text) {
            // Response send in text, not as response from a card

            // In a group chat, the raw command can be prefixed with the display name of the bot
            // where the tag is. Thus, remove this from the start of the raw command.
            // This will only replace the first occurrence of the target string.
            messageData.text = messageData.text.replace((await BOT.people.get('me')).displayName, '').trim();
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
            // TODO: data type should be easier to work with
            if (data instanceof Object && data.action) delete data.action;
            if (data) {
                commandData = {
                    action: command,
                    data: data
                };
                break;
            }
        }
        return {
            rawCommand: rawCommand instanceof Object ? rawCommand.action : rawCommand,
            destination: destination,
            debug: debug,
            user: user,
            data: commandData.data,
            action: commandData.action,
            mentions: mentions.filter(i => i !== me.id)
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