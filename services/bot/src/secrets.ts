import fs from 'fs';

export const GET = (secret: string): string => {
    if (['production', 'development'].includes(process.env.NODE_ENV || '')) {
        return fs.readFileSync(`/run/secrets/${secret}`, 'utf8').trim();
    } else {
        return fs.readFileSync(`../../${secret}`, 'utf8').trim();
    }
};