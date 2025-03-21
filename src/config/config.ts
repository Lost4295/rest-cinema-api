import dotenv from 'dotenv';

dotenv.config();

export interface Configuration {
    dbName: string;
    dbPassword: string;
    dbUser: string;
    dbSynchronise: boolean;
    dbHost: string;
    accessTokenSecret: string;
}

const initConfig = (): Configuration => {
    const {
        DB_NAME,
        DB_PASSWORD,
        DB_USER,
        DB_SYNCHRONISE,
        DB_HOST,
        ACCESS_TOKEN_SECRET,
    } = process.env;

    if (!DB_NAME || !DB_PASSWORD || !DB_SYNCHRONISE || !DB_USER || !DB_HOST || !ACCESS_TOKEN_SECRET) {
        throw new Error("Missing environment variables");
    }

    return {
        dbName: DB_NAME,
        dbPassword: DB_PASSWORD,
        dbUser: DB_USER,
        dbSynchronise: DB_SYNCHRONISE.toLowerCase() === "true",
        dbHost: DB_HOST,
        accessTokenSecret: ACCESS_TOKEN_SECRET,
    };
};

export const config: Readonly<Configuration> = initConfig();