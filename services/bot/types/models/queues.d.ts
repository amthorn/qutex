/**
 * @file The descriptions for Qutex Queues; the main data manager objects for qutex.
 * @author Ava Thorn
 */

/**
 * The interface for Qutex Queue; the main data manager objects for qutex.
 */
interface IQueue {

    /**
     * The name of the queue.
     */
    name: string;

    /**
     * An ordered list of members in the queue. Members at the beginning of the list are at the front of the queue.
     */
    members: IQueueMember[];
}

/**
 * The interface for representing queue members; people currently in the queue.
 * The same person can be in the queue multiple times.
 */
interface IQueueMember {

    /**
     * The person object for the queue member.
     */
    person: IPerson;

    /**
     * The time at which this member was added to the queue.
     */
    enqueuedAt: Date;

    /**
     * The time (if any) at which this member was put at the head of the queue.
     */
    atHeadTime: Date | null;
}
