import {afterEach, beforeAll, describe, expect, it} from "@jest/globals"
import app from "../src/app"
import request from "supertest"
import {cleanDB} from "./utils"
import {PrismaClient, Session} from "../src/db/client";

const db = new PrismaClient()


//TODO : test routes
beforeAll(async () => {
    await cleanDB()
})

afterEach(async () => await cleanDB())


describe('session controller :', () => {
    it('returns 200 and nothing on GET:/sessions', async () => {
        const res = await request(app).get('/sessions')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual([])
    })
    it('returns 200 and data on GET:/sessions', async () => {
        const expectedSessions = await createRandomSessions()
        const res = await request(app).get('/sessions')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(expectedSessions)
    })
})


async function createRandomSessions() {
    const cinemaSession: Session[] = []
    for (let i = 1; i < 6; i++) {
        cinemaSession.push({
            id: i,
            startDate: new Date(new Date().getTime() - i * 1000 * 60 * 60),
            endDate: new Date(new Date().getTime() - i * 1000 * 60 * 60 + 1000 * 60 * 60),
            tickets: 0,
            movieId: 1,
            roomId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    }
    await db.movie.create({
        data: {
            id: 1,
            name: 'test',
            duration: 120,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    })
    await db.room.create({
        data: {
            id: 1,
            name: 'test',
            seats: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
            description: "description",
            type: "gdg",
            disabledAccess: false,
            onMaintenance: false
        }
    })
    await db.session.createMany({data: cinemaSession})
    return cinemaSession
}



