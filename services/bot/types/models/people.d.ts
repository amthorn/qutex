interface IPerson {
    /*****************************************************************
     * THIS JUST SAVES US FROM MAKE N REQUESTS FOR N PEOPLE IN QUEUE *
     *****************************************************************/

    /**
     * The personId that identifies the person.
     */
    id: Uuid;
    displayName: string;
    atHeadSeconds: number;
    atHeadCount: number;
    inQueueSeconds: number;
    inQueueCount: number;
}
