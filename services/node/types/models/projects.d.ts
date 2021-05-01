interface IProject {
    name: string;
    /**
     * This is the currently set implicit queue.
     */
    currentQueue: string;
    admins: IPerson[];
    queues: IQueue[];
}
