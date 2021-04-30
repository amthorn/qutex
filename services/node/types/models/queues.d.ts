interface IQueue {
    name: string;
    members: IQueueMember[];
}

interface IQueueMember {
    person: IPerson;
    enqueuedAt: Date;
    atHeadTime: Date | null;
}
