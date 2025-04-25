import {describe, expect, it} from "@jest/globals"
import app from "../src/app"
import request from "supertest"
import {PrismaClient} from "../src/db/client";

const db = new PrismaClient()


//TODO : test routes


describe('session controller :', () => {
    it('returns 200 and nothing on GET:/sessions', async () => {
        const res = await request(app).get('/sessions')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual([])
    })
    it('returns 200 and data on GET:/sessions', async () => {
        const expectedSessions = await db.session.findMany()
        const res = await request(app).get('/sessions')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(expectedSessions)
    })
})



