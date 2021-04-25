const enum CommandType {
    GET = 'get',
    LIST = 'list'

}

interface Command {
    /**
     * This function should return a boolean which tells the caller
     * whether this command applies to the given string parameter
     */
    check: (command: string) => boolean;

    /**
     * This function should perform the action of the command
     */
    relax: (initiative: Initiative) => string;

    /**
     * this property should determine what kind of command this is
     * Possible commands are listed by the enum type CommandType
     */
    readonly COMMAND_TYPE: CommandType;

}