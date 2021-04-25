interface Destination {
    roomId?: Uuid;
    toPersonId?: Uuid;
    toPersonEmail?: Email;
}

interface Initiative {
    /********************************************************
     * THIS IS THE RAW COMMAND PARSED FROM THE REQUEST      *
     *                                                      *
     * EXAMPLES:                                            *
     * 1) SHOW ADMIN COMMANDS                               *
     * 2) ADD ME                                            *
     ********************************************************/
    rawCommand: string;

    destination: Destination;

}