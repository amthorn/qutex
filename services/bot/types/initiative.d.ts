/**
 * @file The descriptions for interfaces related to data containers passed around the bot.
 * @author Ava Thorn
 */

/**
 * Interface for Qutex destinations. A destination is a room or a direct message.
 */
interface Destination {

    /**
     * A destination's room ID. This is required only if the destination is a room.
     */
    roomId?: Uuid;

    /**
     * A destination's person ID. This (or toPersonEmail) is required only if the destination is direct message.
     */
    toPersonId?: Uuid;

    /**
     * A destination's person email. This (or toPersonId) is required only if the destination is direct message.
     */
    toPersonEmail?: Email;
}

/**
 * Represents the data payload within the initiative.
 */
interface IInitiativeData {

    /**
     * The name of the entity for which the initiative applies.
     */
    name?: string;

    /**
     * Some commands allow for the specification of a custom non-default queue.
     */
    queue?: string;
}

/**
 * The is the interface for an initiative; a data container for moving relevant data to the command around the app
 * during various stages of processing.
 */
interface IInitiative {

    /**
     * This is the raw command parsed from the request.
     *
     * @example show admin commands
     * @example add me
     */
    rawCommand: string;

    /**
     * This is the initiative's destination.
     */
    destination: Destination;

    /**
     * The invoker of the initiative.
     */
    user: Person;

    /**
     * The parsed action for the initiative. This is populated after the raw command is parsed
     * and an action is determined.
     */
    action?: Command;

    /**
     * This is the parsed data from the command that will be sent to the command engine.
     */
    data: IInitiativeData;

    /**
     * Whether or not this initiative is running in debug mode. Set by the user via a "| debug"
     * pipe appended to the end of the raw command string.
     */
    debug: boolean;

    /**
     * A list of personIds for anyone mentioned in the message. This is used by some commands to determine other people
     * (aside from the invoker) without having to requery the webex API to get their ID.
     */
    mentions: string[];

    /**
     * This is the time that the initiative was received. It is useful when storing in mongo.
     */
    time?: Date;

    /**
     * This object shows the similarity for the closest matched command if the command is unrecognized.
     */
    similarity: Record<string, Command | number>;

}