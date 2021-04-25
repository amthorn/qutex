declare module 'webex/env';

declare type WebexPerson = {
    id: string;
};

declare type WebexWebhook = {
    id: string;
};

declare enum RoomType {
    DIRECT = 'direct',
    GROUP = 'group'
}

declare type Uuid = string;
declare type Email = string;
declare type DateTime = string;

interface WebexMessage {
    id: Uuid;
    roomId: Uuid;
    roomType: RoomType;
    text: string;
    personId: Uuid;
    personEmail: Email;
    created: DateTime;
}