import {AppDataSource} from "../src/db/database"
import {Movie} from "../src/db/models/Movie"
import {CinemaSession} from "../src/db/models/CinemaSession"
import {CinemaRoom} from "../src/db/models/CinemaRoom";

export async function cleanDB() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize()
    }
    const movies = await AppDataSource.getRepository(Movie).find()
    await AppDataSource.getRepository(Movie).remove(movies)
    const rooms = await AppDataSource.getRepository(CinemaRoom).find()
    await AppDataSource.getRepository(CinemaRoom).remove(rooms)
    const sessions = await AppDataSource.getRepository(CinemaSession).find()
    await AppDataSource.getRepository(CinemaSession).remove(sessions)
}
