interface Webhook {
    id: string;
}

interface WebexPerson {
    id: string;
}

enum RoomType {
    DIRECT = 'direct',
    GROUP = 'group'
}

type Uuid = string;
type Email = string;
type DateTime = string;

interface WebexMessage {
    id: Uuid;
    roomId: Uuid;
    roomType: RoomType;
    text: string;
    personId: Uuid;
    personEmail: Email;
    created: DateTime;
}

interface WebexAttachmentAction {
    id: Uuid;
    type: string;
    roomId: Uuid;
    inputs: object;
    personId: Uuid;
    messageId: Uuid;
    created: DateTime;
}