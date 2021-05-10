/**
 * @file The descriptions for the registration object. Which maps destinations (rooms or dms) to Qutex Projects.
 * @author Ava Thorn
 */

/**
 * The interface handling registrations which maps destinations (rooms or dms) to Qutex Projects.
 */
interface IRegistration {
    /**
     * The destination ID for the registration.
     * This will be a personId, personEmail, or a roomId.
     *
     * @see IWebexMessage
     */
    destination: Destination;
    /**
     * The project name for the registration.
     */
    projectName: string;
}