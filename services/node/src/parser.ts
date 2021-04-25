import { Request } from 'express';
import { Bot } from './bot';

export class Parser extends Bot {
    public async parse (request: Request): Promise<Initiative> {
        return this.getMessageData(request).then(messageData => {
            const destination: Destination = {};
            if (messageData.personEmail) {
                destination.toPersonEmail = messageData.personEmail;
            } else if (messageData.personId) {
                destination.toPersonId = messageData.personId;
            } else {
                destination.toRoomId = messageData.roomId;
            }
            return { rawCommand: messageData.text, destination: destination };
        });
    }
    private async getMessageData (request: Request): Promise<WebexMessage> {
        const messageId = request.body.data.id;
        if (messageId) {
            return this.bot.messages.get(messageId).then((messageData: WebexMessage) => {
                return messageData;
            });
        } else {
            // TODO: fix me
            return { text: 'foo' } as WebexMessage;
        }
    }
}