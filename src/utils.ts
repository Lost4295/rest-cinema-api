import {PrismaClient} from './db/client'
import * as Moment from 'moment'
import moment from 'moment'
import {extendMoment} from 'moment-range'

const momentRanger = extendMoment(Moment)
const db = new PrismaClient()

export async function cleanDB() {
    await db.movie.deleteMany({where: {}})
    await db.room.deleteMany({where: {}})
    await db.session.deleteMany({where: {}})
}


export function isChevauchement(sessions: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    movieId: number;
    startDate: Date;
    endDate: Date;
    roomId: number;
}[], body: { startDate: Date, endDate: Date, roomId: number, movieId: number }): boolean {
    const momentstart = moment(body.startDate)
    const endmoment = moment(body.endDate)
    for (const session of sessions) {
        const start = moment(session.startDate)
        const end = moment(session.endDate)
        const sessionRange = momentRanger.range(start, end)
        const testedRange = momentRanger.range(momentstart, endmoment)
        if (sessionRange.overlaps(testedRange) && ((body.roomId === session.roomId) || (body.movieId === session.movieId))) {
            return true
        }
    }
    return false
}
