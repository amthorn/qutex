interface IProject {
    name: string;
    /**
     * This is the currently set implicit queue.
     */
    currentQueue: IQueue;
    queues: IQueue[];
}
