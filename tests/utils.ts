import {PrismaClient} from '../src/db/client'

const db = new PrismaClient()

export async function cleanDB() {
    await db.movie.deleteMany({where: {}})
    await db.room.deleteMany({where: {}})
    await db.session.deleteMany({where: {}})
}
