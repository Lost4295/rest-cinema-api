import {AppDataSource} from "../src/db/database"
import {Movie} from "../src/db/models/Movie"
import {CinemaSession} from "../src/db/models/CinemaSession"
import {CinemaRoom} from "../src/db/models/CinemaRoom";

export async function cleanDB() {
    await AppDataSource.createQueryBuilder().delete().from(Movie).execute()
    await AppDataSource.createQueryBuilder().delete().from(CinemaRoom).execute()
    await AppDataSource.createQueryBuilder().delete().from(CinemaSession).execute()
}
