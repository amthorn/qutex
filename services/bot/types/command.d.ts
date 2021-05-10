/**
 * @file The descriptions for individual command definition classes.
 * @author Ava Thorn
 */

/**
 * An enum for the different command types.
 *
 * @enum
 */
const enum CommandType {
    GET = 'get',
    LIST = 'list',
    CREATE = 'create',
    DELETE = 'delete',
    CARD = 'card',
    /**
     * This command type is for operations that take actions on existing objects
     * without deleting or creating them. Such as changing the state of an existing object
     * by adding a user to queue.
     */
    OPERATION = 'operation'

}

/**
 * The interface for command objects.
 *
 * @interface
 */
interface ICommand {
    /**
     * This function should return an object of parse data.
     * The existence of this object should tell the caller
     * whether this command applies to the given string parameter.
     *
     * @access public
     */
    check: (command: string) => Promise<Record<string, string> | boolean | string | null | undefined>;

    /**
     * This function should perform the action of the command.
     *
     * @param initiative - The initiative for the operation.
     * @returns The response string.
     * @access public
     */
    relax: (initiative: Initiative) => Promise<string>;
    /**
     * This is a helper property which is implemented on the base class that can construct
     * the value of the target command.
     *
     * @access public
     */
    command: string;

    /**
     * This property should determine what kind of command this is.
     * Possible commands are listed by the enum type CommandType.
     *
     * @access public
     * @readonly
     */
    readonly COMMAND_TYPE: CommandType;

    /**
     * This string is what is used to store arguments for the command string.
     *
     * @access public
     * @readonly
     */
    readonly ARGS?: string;

    /**
     * This is the string which does not include arguments.
     *
     * @access public
     * @readonly
     */
    readonly COMMAND_BASE: string;

    /**
     * This is a short description of the command which is displayed in the help card.
     *
     * @access public
     * @readonly
     */
    readonly DESCRIPTION: string;

    /**
     * This defines who can run the command.
     *
     * @access public
     * @readonly
     */
    readonly AUTHORIZATION: Auth;

}