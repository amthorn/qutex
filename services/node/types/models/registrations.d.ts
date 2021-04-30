interface IRegistration {
    /*******************************************
     * THIS TIES A ROOM OR PERSON TO A PROJECT *
     *******************************************/

    /**
     * The destination ID for the registration.
     * This will be a personId, personEmail, or a roomId
     */
    destination: Destination;
    projectName: string;
}