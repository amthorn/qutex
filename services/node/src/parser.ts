import { Request } from 'express';
import { BOT } from './bot';
import Commands from './commands';

export class Parser {
    public async parse (request: Request): Promise<Initiative> {
        const messageData = await this.getMessageData(request);
        const destination: Destination = {};

        if (messageData.personEmail) {
            destination.toPersonEmail = messageData.personEmail;
        } else if (messageData.personId) {
            destination.toPersonId = messageData.personId;
        } else {
            destination.roomId = messageData.roomId;
        }

        // Determine the appropriate action

        for (const command of Commands) {
            const data = await command.check(messageData.text);
            if (data) {
                return { rawCommand: messageData.text, destination: destination, action: command, data: data };
            }
        }
        return { rawCommand: messageData.text, destination: destination };

    }
    private async getMessageData (request: Request): Promise<WebexMessage> {
        const messageId = request.body.data.id;
        return await BOT.messages.get(messageId);
    }
}