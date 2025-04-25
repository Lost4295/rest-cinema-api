import {describe, expect, it} from "@jest/globals"
import app from "../src/app"
import request from "supertest"
import {PrismaClient} from '../src/db/client'

const db = new PrismaClient()

//TODO : test routes



describe("room controller ", () => {
    it('returns 200 and nothing on GET:/rooms', async () => {
        const res = await request(app).get('/rooms')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual([])
    })
    it('returns 200 and data on GET:/rooms', async () => {
        const expectedRooms = await db.room.findMany()
        const res = await request(app).get('/rooms')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(expectedRooms)
    })
})

