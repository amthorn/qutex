interface IProjectAdmin {
    id: Uuid;
    displayName: string;
}

interface IProject {
    name: string;
    /**
     * This is the currently set implicit queue.
     */
    currentQueue: string;
    admins: IProjectAdmin[];
    queues: IQueue[];
}
