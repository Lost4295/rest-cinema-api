import {PrismaClient} from './db/client'
import * as Moment from 'moment'
import moment from 'moment'
import {extendMoment} from 'moment-range'

const momentRanger = extendMoment(Moment)
const db = new PrismaClient()

export function jfy(data: any) {
    return JSON.parse(JSON.stringify(data))
}

export function isEmpty(obj: {}) {
    return Object.keys(obj).length === 0
}


export function isChevauchement(sessions: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    movieId: number;
    startDate: Date;
    endDate: Date;
    roomId: number;
}[], body: { startDate: Date, endDate: Date, room: number, movie: number }): boolean {
    const momentstart = moment(body.startDate)
    const endmoment = moment(body.endDate)
    for (const session of sessions) {
        const start = moment(session.startDate)
        const end = moment(session.endDate)
        const sessionRange = momentRanger.range(start, end)
        const testedRange = momentRanger.range(momentstart, endmoment)
        if (start.isSame(momentstart) && end.isSame(endmoment)) {
            return true
        }
        if (sessionRange.overlaps(testedRange) && ((body.room === session.roomId) || (body.movie === session.movieId))) {
            return true
        }
    }
    return false
}

export async function deleteAll() {
    await db.session.deleteMany()
    await db.user.deleteMany()
    await db.movie.deleteMany()
    await db.ticket.deleteMany()
    await db.superTicket.deleteMany()
    await db.room.deleteMany()
    await db.ticket.deleteMany()
    await db.token.deleteMany()
}
