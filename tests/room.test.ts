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
        const expectedRooms = await createRandomRooms()
        const res = await request(app).get('/rooms')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(expectedRooms)
    })
})


async function createRandomRooms() {
    const rooms: any[] = []
    for (let i = 1; i < 15; i++) {
        rooms.push({
            id: i,
            name: "Salle " + i,
            description: "Salle vraiment sympa pour regarder des films. C'est la salle numéro " + i + ".",
            images: [],
            type: "Type de la salle, genre 3D, 4D, jsp",
            seats: Number(Number(Math.random() * 100).toFixed()),
            disabledAccess: Math.random() * 100 % 2 == 0,
            onMaintenance: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
    }
    await db.room.createMany({data: rooms})
    return rooms
}
