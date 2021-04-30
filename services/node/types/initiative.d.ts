interface Destination {
    roomId?: Uuid;
    toPersonId?: Uuid;
    toPersonEmail?: Email;
}

interface IInitiative {
    /********************************************************
     * THIS IS THE RAW COMMAND PARSED FROM THE REQUEST      *
     *                                                      *
     * EXAMPLES:                                            *
     * 1) SHOW ADMIN COMMANDS                               *
     * 2) ADD ME                                            *
     ********************************************************/
    rawCommand: string;

    destination: Destination;

    user: Person;

    action?: Command;

    /***********************************************************************************
     * THIS IS THE ACTUAL PARSED DATA FROM THE COMMAND THAT WILL BE SENT TO THE ENGINE *
     ***********************************************************************************/
    data: Record<string, string>;
    debug: boolean;

}