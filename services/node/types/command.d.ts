const enum CommandType {
    GET = 'get',
    LIST = 'list',
    CREATE = 'create'

}

interface Command {
    /**
     * This function should return an object of parse data.
     * The existence of this object should tell the caller
     * whether this command applies to the given string parameter
     */
    check: (command: string) => Promise<any>;

    /**
     * This function should perform the action of the command
     */
    relax: (initiative: Initiative) => Promise<string>;

    /**
     * this property should determine what kind of command this is
     * Possible commands are listed by the enum type CommandType
     */
    readonly COMMAND_TYPE: CommandType;

}