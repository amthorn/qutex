/**
 * @file The descriptions for various webex objects. This is needed cause @types/webex doesn't exist.
 * @author Ava Thorn
 */

/**
 * A partial interface for a webex webhook.
 */
interface IWebhook {

    /**
     * The ID for the webhook.
     */
    id: string;

    /**
     * The target URL where the webhook will sent a POST to when triggered.
     */
    targetUrl: string;
}

/**
 * A partial interface for a webex person.
 */
interface IWebexPerson {

    /**
     * The ID for the person. This can be used for sending messages via toPersonId.
     */
    id: string;

    /**
     * A list of email addresses for the person. This can be used for sending messages via toPersonEmail.
     */
    emails: string[];
}
/**
 * Enumerated data type for a webex room type.
 * Either direct or group.
 */
enum RoomType {
    DIRECT = 'direct',
    GROUP = 'group'
}

/**
 * The UUID type for UUID strings.
 */
type Uuid = string;

/**
 * The Email type for email address strings.
 */
type Email = string;

/**
 * DateTime type for datetime strings.
 */
type DateTime = string;

/**
 * A partial interface for webex messages.
 */
interface IWebexMessage {
    /**
     * The ID for the message.
     */
    id: Uuid;
    /**
     * The roomId for the webex message. If this is a direct message,
     * it will be the personId for the direct message recipient.
     */
    roomId: Uuid;
    /**
     * The roomType for the message. Either direct or group.
     */
    roomType: RoomType;
    /**
     * The content string of the message.
     */
    text: string;
    /**
     * The personId sender of the message.
     */
    personId: Uuid;
    /**
     * The personEmail sender of the message.
     */
    personEmail: Email;
    /**
     * When the message was sent.
     */
    created: DateTime;
}

/**
 * A partial interface for a webex attachment action.
 */
interface IWebexAttachmentAction {

    /**
     * The ID for the webex attachment action.
     */
    id: Uuid;

    /**
     * TODO:.
     */
    type: string;

    /**
     * The roomId where the attachment action was sent from.
     */
    roomId: Uuid;

    /**
     * The data from the attachment action.
     */
    inputs: Record<string, unknown>;

    /**
     * The personEmail sender of the message.
     */
    personId: Uuid;

    /**
     * The messageId of the originating message for the attachment action.
     */
    messageId: Uuid;

    /**
     * The date the attachment action was sent.
     */
    created: DateTime;
}