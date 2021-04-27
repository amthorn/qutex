import { Request } from 'express';
import { BOT } from './bot';
import Commands from './commands';

export class Parser {
    public async parse (request: Request): Promise<Initiative> {
        const messageId = request.body.data.id;
        let messageData;
        if (request.body.resource == 'attachmentActions') {
            messageData = await BOT.attachmentActions.get(messageId);
        } else { // if (request.body.resource == 'messages') {
            messageData = await BOT.messages.get(messageId);
        }

        const destination: Destination = {};

        if (messageData.personEmail) {
            destination.toPersonEmail = messageData.personEmail;
        } else if (messageData.personId) {
            destination.toPersonId = messageData.personId;
        } else {
            destination.roomId = messageData.roomId;
        }
        
        const rawCommand = messageData.text ? messageData.text : this.normalize(messageData.inputs);

        // Determine the appropriate action
        for (const command of Commands) {
            const data = await command.check(rawCommand);
            if (data) {
                return { rawCommand: rawCommand, destination: destination, action: command, data: data };
            }
        }
        return { rawCommand: rawCommand, destination: destination };

    }
    private normalize (data: any): any {
        let result: any = {};
        for (const key of Object.keys(data)) {
            result[key.replace('_', '')] = data[key];
        }
        return result;
    }
}