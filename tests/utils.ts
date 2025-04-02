import {AppDataSource} from "../src/db/database"
import {Movie} from "../src/db/models/Movie"
import {CinemaSession} from "../src/db/models/CinemaSession"
import {CinemaRoom} from "../src/db/models/CinemaRoom";

export async function cleanDB() {
    await AppDataSource.createQueryBuilder().from(Movie, "mov").delete().execute()
    await AppDataSource.createQueryBuilder().from(CinemaRoom, "cr").delete().execute()
    await AppDataSource.createQueryBuilder().from(CinemaSession, "cs").delete().execute()
}
