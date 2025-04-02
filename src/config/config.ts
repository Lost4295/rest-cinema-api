import dotenv from 'dotenv'

dotenv.config()

export interface Configuration {
    env: string
    dbName: string
    dbPassword: string
    dbUser: string
    dbSynchronise: boolean
    dbHost: string
    accessTokenSecret: string
    refreshTokenSecret: string
    port: number
    apiUrl: string

}

const initConfig = (): Configuration => {
    const {
        ENV,
        DB_NAME,
        DB_PASSWORD,
        DB_USER,
        DB_SYNCHRONISE,
        DB_HOST,
        ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET,
        PORT,
        API_URL
    } = process.env

    if (!DB_NAME || !DB_PASSWORD || !DB_SYNCHRONISE || !DB_USER || !DB_HOST || !ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET || !PORT || !API_URL) {
        throw new Error("Missing environment variables")
    }

    return {
        env: ENV || "development",
        dbName: DB_NAME,
        dbPassword: DB_PASSWORD,
        dbUser: DB_USER,
        dbSynchronise: DB_SYNCHRONISE.toLowerCase() === "true",
        dbHost: DB_HOST,
        accessTokenSecret: ACCESS_TOKEN_SECRET,
        refreshTokenSecret: REFRESH_TOKEN_SECRET,
        port: parseInt(PORT),
        apiUrl: API_URL
    }
}

export const config: Readonly<Configuration> = initConfig()
