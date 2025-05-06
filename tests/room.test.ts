import {describe, expect, it} from "@jest/globals"
import app from "../src/app"
import request from "supertest"
import {PrismaClient} from '../src/db/client'
import {jfy} from "../src/utils"
import {cinemaRoomIdValidator, createCinemaRoomValidator, updateCinemaRoomValidator} from "../src/validators/rooms"
import moment from "moment/moment";

const db = new PrismaClient()

export async function createSpecialRoom() {
    return db.room.create({
        select: {id: true},
        data: {
            name: "TestRoom",
            description: "TestRoom",
            images: [],
            type: "TestRoom",
            seats: 20,
            disabledAccess: false,
            sessions: {
                createMany: {
                    data: [
                        {
                            movieId: 2,
                            startDate: moment().subtract("5", "months").subtract(20, "minutes").toDate(),
                            endDate: moment().subtract("5", "months").toDate()
                        },
                        {
                            movieId: 2,
                            startDate: moment().subtract("5", "months").subtract(20, "minutes").toDate(),
                            endDate: moment().subtract("5", "months").toDate()
                        },
                        {
                            movieId: 2,
                            startDate: moment().add("1", "days").toDate(),
                            endDate: moment().add(1, "days").add(35, 'minutes').toDate()
                        },
                        {
                            movieId: 2,
                            startDate: moment().add("2", "days").toDate(),
                            endDate: moment().add(2, "days").add(35, 'minutes').toDate()
                        },
                        {movieId: 2, startDate: moment().toDate(), endDate: moment().toDate()},
                    ]
                }
            },
        }
    })
}

describe("room controller ", () => {
    it('returns 200 and data on GET:/rooms', async () => {
        const expectedRooms = jfy((await db.room.findMany({where: {onMaintenance: false}})))
        const res = await request(app).get('/rooms')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(expectedRooms)
    })
    it('returns 400 on invalid data on POST:/rooms', async () => {
        const expectedErrorObject = createCinemaRoomValidator.validate({})
        const res = await request(app).post('/rooms')
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(expectedErrorObject!.error!.message)

    })
    it('returns 201 on good data on POST:/rooms', async () => {
        const expectedErrorObject = createCinemaRoomValidator.validate({
            name: "Nom de salle",
            description: "LA description",
            type: "5D poto",
            images: [],
            seats: 25,
            disabledAccess: false
        })
        const res = await request(app).post('/rooms').send(expectedErrorObject.value)
        expect(res.body.message).toEqual("Ressource created successfully.")
        expect(res.statusCode).toEqual(201)

    })
    it('returns 400 on invalid data on PUT:/rooms', async () => {
        const expectedErrorObject = updateCinemaRoomValidator.validate({})
        const res = await request(app).put('/rooms/' + 2)
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(expectedErrorObject!.error!.message)
    })
    it('returns 400 on invalid id on PUT:/rooms', async () => {
        const roomBody = updateCinemaRoomValidator.validate({
            seats: 18
        })
        const expectedErrorObject = cinemaRoomIdValidator.validate({id: "ughbjhyhg"})
        const res = await request(app).put("/rooms/ughbjhyhg").send(roomBody.value)
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(expectedErrorObject!.error!.message)
        const expectedErrorObject3 = cinemaRoomIdValidator.validate({id: 65255451562363959})
        const res3 = await request(app).put("/rooms/65255451562363959").send(roomBody.value)
        expect(res3.statusCode).toEqual(400)
        expect(res3.body.message).toEqual(expectedErrorObject3!.error!.message)
    })
    it('returns 404 on PUT:/rooms', async () => {
        const roomBody = updateCinemaRoomValidator.validate({
            seats: 18
        })
        const id = 9586 // find way to get id that doesn't exist
        const res = await request(app).put("/rooms/" + id).send(roomBody.value)
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("ressource not found")
    })
    it('returns 200 on PUT:/rooms', async () => {
        const roomBody =
            {
                name: "Nom de salle",
                description: "La description de fou",
                type: "5D poto",
                images: [],
                seats: 25,
                disabledAccess: false
            }
        await db.room.deleteMany({where: {description: roomBody.description}})
        const a = await request(app).post("/rooms/").send(roomBody)
        expect(a.body.message).toEqual("Ressource created successfully.")
        expect(a.statusCode).toEqual(201)
        const data = {
            seats: 20,
            description: "nouvelle description"
        }
        let room = await db.room.findFirstOrThrow({where: {description: roomBody.description}})
        const res = await request(app).put("/rooms/" + room.id).send(data)
        room = await db.room.findFirstOrThrow({where: {description: data.description}})
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("Ressource modified successfully")
        expect(room.description).toEqual(data.description)
        expect(room.seats).toEqual(data.seats)
        await db.room.deleteMany({where: {description: roomBody.description}})
    })
    it('returns 400 on invalid id on DELETE:/rooms', async () => {
        const errorValidator = cinemaRoomIdValidator.validate({id: "titi"})
        const res = await request(app).delete("/rooms/titi")
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(errorValidator.error!.message)
        const expectedErrorObject3 = cinemaRoomIdValidator.validate({id: 65255451562363959})
        const res3 = await request(app).delete("/rooms/65255451562363959")
        expect(res3.statusCode).toEqual(400)
        expect(res3.body.message).toEqual(expectedErrorObject3!.error!.message)
    })
    it('returns 404 on DELETE:/rooms', async () => {
        const id = 8956 //find better way to handle test
        const res = await request(app).delete("/rooms/" + id)
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("ressource not found")
    })
    it('returns 204 on DELETE:/rooms', async () => {
        const roomBody =
            {
                name: "Nom de salle",
                description: "Insérer une description",
                type: "5D poto",
                images: [],
                seats: 25,
                disabledAccess: false
            }
        await db.room.deleteMany({where: {description: roomBody.description}})
        await request(app).post("/rooms/").send(roomBody)
        let room = await db.room.findFirstOrThrow({where: {description: roomBody.description}})
        const res = await request(app).delete("/rooms/" + room.id)
        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
    })
    it('returns 400 on invalid id on GET:/rooms/{id}', async () => {
        const expectedErrorObject = cinemaRoomIdValidator.validate({id: "ughbjhyhg"})
        const res = await request(app).get("/rooms/ughbjhyhg")
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(expectedErrorObject!.error!.message)
        const expectedErrorObject3 = cinemaRoomIdValidator.validate({id: 65255451562363959})
        const res3 = await request(app).get("/rooms/65255451562363959")
        expect(res3.statusCode).toEqual(400)
        expect(res3.body.message).toEqual(expectedErrorObject3!.error!.message)
    })
    it('returns 404 on GET:/rooms/{id}', async () => {
        const id = 9586 // find way to get id that doesn't exist
        const res = await request(app).get("/rooms/" + id)
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("ressource not found")
    })
    it('returns 200 on GET:/rooms/{id}', async () => {
        const id = (await createSpecialRoom()).id
        let room = await db.room.findFirstOrThrow({
            where: {
                id: id
            },
            include: {
                sessions: {
                    include: {
                        movie: true
                    }
                }
            }
        })
        const sessions = jfy(room.sessions)
        const res = await request(app).get("/rooms/" + id).send({allSessions: true})
        expect(res.statusCode).toEqual(200)
        expect(res.body.sessions).toEqual(sessions)

        const period = {
            startDate: moment(new Date()).toISOString(),
            endDate: moment(new Date()).add(2, 'days').toISOString()
        }
        const filteredSessions2 = sessions.filter((session: {
            startDate: moment.MomentInput;
            endDate: moment.MomentInput
        }) => {
            return moment(session.startDate).isBetween(moment(period.startDate), moment(period.endDate))
                && moment(session.endDate).isBetween(moment(period.startDate), moment(period.endDate))
        })

        const res3 = await request(app).get("/rooms/" + id).send(period)
        expect(res3.statusCode).toEqual(200)
        expect(res3.body.sessions).toEqual(filteredSessions2)
        const filteredSessions = sessions.filter((session: { startDate: moment.MomentInput }) => {
            return moment(session.startDate).isAfter(moment())
        })
        const res2 = await request(app).get("/rooms/" + id)
        expect(res2.statusCode).toEqual(200)
        expect(res2.body.sessions).toEqual(filteredSessions)
    })
    it('returns 404 on GET:/rooms/{id}/maintenance/on', async () => {
        const id = 8956
        const res = await request(app).get('/rooms/' + id + '/maintenance/on')
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("ressource not found")
    })
    it('returns 200 on GET:/rooms/{id}/maintenance/on', async () => {
        const res = await request(app).get('/rooms/' + 5 + '/maintenance/on')
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("room on maintenance")
    })
    it('returns 404 on GET:/rooms/{id}/maintenance/off', async () => {
        const id = 8565
        const res = await request(app).get('/rooms/' + id + '/maintenance/off')
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("ressource not found")
    })
    it('returns 200 on GET:/rooms/{id}/maintenance/off', async () => {
        const res = await request(app).get('/rooms/' + 5 + '/maintenance/off')
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("room no longer on maintenance")
    })

})

