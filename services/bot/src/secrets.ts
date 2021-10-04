/**
 * @file This file controls the retrieval of secrets. If it is in a production environment, it will read
 * the docker secrets. Otherwise, it will use the secret files stored locally.
 * @author Ava Thorn
 */
import fs from 'fs';
/**
 * This function gets a target secret from the appropriate location depending on the environment of the application.
 *
 * @param secret - The name of the secret to retrieve.
 * @returns The secret content.
 */
export const GET = (secret: string): string => {
    if (['production', 'development'].includes(process.env.NODE_ENV || '')) {
        return fs.readFileSync(`/run/secrets/${secret}`, 'utf8').trim();
    } else {
        return fs.readFileSync(`../../secrets/local/${secret}`, 'utf8').trim();
    }
};