interface IWebhook {
    id: string;
    targetUrl: string;
}

interface IWebexPerson {
    id: string;
    emails: string[];
}

enum RoomType {
    DIRECT = 'direct',
    GROUP = 'group'
}

type Uuid = string;
type Email = string;
type DateTime = string;

interface IWebexMessage {
    id: Uuid;
    roomId: Uuid;
    roomType: RoomType;
    text: string;
    personId: Uuid;
    personEmail: Email;
    created: DateTime;
}

interface IWebexAttachmentAction {
    id: Uuid;
    type: string;
    roomId: Uuid;
    inputs: Record<string, unknown>;
    personId: Uuid;
    messageId: Uuid;
    created: DateTime;
}