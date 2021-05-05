const FS = require('fs');
const GET = (secret) => {
    if (['production', 'development'].includes(process.env.NODE_ENV || '')) {
        return FS.readFileSync(`/run/secrets/${secret}`, 'utf8').trim();
    } else {
        return FS.readFileSync(`../../${secret}`, 'utf8').trim();
    }
};

const config = {
    mongodb: {
        url: `mongodb://root:${GET('mongoPassword')}@mongo:27017/qutex?authSource=admin`,

        options: {
            useNewUrlParser: true, // removes a deprecation warning when connecting
            useUnifiedTopology: true, // removes a deprecating warning when connecting
            //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
            //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
        }
    },

    // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
    migrationsDir: "migrations",

    // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
    changelogCollectionName: "changelog",

    // The file extension to create migrations and search for in migration dir 
    migrationFileExtension: ".js",

    // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
    // if the file should be run.  Requires that scripts are coded to be run multiple times.
    useFileHash: false
};

// Return the config as a promise
module.exports = config;
