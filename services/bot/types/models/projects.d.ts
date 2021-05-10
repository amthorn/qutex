/**
 * @file The descriptions for Qutex Projects. Qutex projects are registered to destinations and hold one or more queues.
 * @author Ava Thorn
 */

/**
 * The interface for project administrators. This is mainly stored in the database so we don't have to requery
 * the webex API for redundant information.
 */
interface IProjectAdmin {

    /**
     * The ID for the project administrator. This will match the webex personId.
     *
     * @see IWebexPerson
     */
    id: Uuid;

    /**
     * The display name for the project administrator. This will match the webex displayName.
     *
     * @see IWebexPerson
     */
    displayName: string;
}

/**
 * The interface for Qutex projects.
 */
interface IProject {

    /**
     * The name of the project.
     */
    name: string;

    /**
     * This is the currently set implicit queue.
     */
    currentQueue: string;

    /**
     * A list of project administrators for the project.
     */
    admins: IProjectAdmin[];

    /**
     * A list of configured queues for the project, one of which must
     * have the name shared by the currentQueue attribute.
     */
    queues: IQueue[];
}
