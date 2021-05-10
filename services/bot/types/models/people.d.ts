/**
 * @file The descriptions for Qutex People. People will maintain aggregate data about each individual person that has
 * been added to a queue before.
 * @author Ava Thorn
 */

/**
 * The interface for a Qutex Person. This saves us from making multiple requests to the webex API
 * for multiple people in a queue.
 */
interface IPerson {

    /**
     * The personId that identifies the person. This will match the webex personId.
     *
     * @see IWebexPerson
     */
    id: Uuid;

    /**
     * The display name that identifies the person. This will match the webex displayName.
     *
     * @see IWebexPerson
     */
    displayName: string;

    /**
     * The total number of seconds that this person has ever been at the head of any queue.
     */
    atHeadSeconds: number;

    /**
     * The number of times this person has been at the head of the queue.
     */
    atHeadCount: number;

    /**
     * The total number of seconds that this person has ever been in any queue.
     */
    inQueueSeconds: number;

    /**
     * The number of times this person has been in any queue.
     */
    inQueueCount: number;
}
