import {describe, expect, it} from "@jest/globals"
import app from "../src/app"
import request from "supertest"
import {PrismaClient} from "../src/db/client";
import {jfy} from "../src/utils"
import moment from "moment";
import {sessionOptionsValidator} from "../src/validators/period";
import {
    cinemaSessionIdValidator,
    createCinemaSessionValidator,
    updateCinemaSessionValidator
} from "../src/validators/session";

const db = new PrismaClient()


describe('session controller :', () => {
    it('returns 200 and data on GET:/sessions', async () => {
        const expectedSessions = await db.session.findMany({
            where: {
                room: {
                    onMaintenance: false
                }
            }
        })
        const filteredSessions = expectedSessions.filter((session: { startDate: moment.MomentInput }) => {
            return moment(session.startDate).isAfter(moment())
        })
        const res = await request(app).get('/sessions')
        expect(res.statusCode).toEqual(200)
        expect(res.body.sessions).toEqual(jfy(filteredSessions))

        const res2 = await request(app).get("/sessions/").send({allSessions: true})
        expect(res2.statusCode).toEqual(200)
        expect(res2.body.sessions).toEqual(jfy(expectedSessions))

        const period = {
            startDate: moment(new Date()).toISOString(),
            endDate: moment(new Date()).add(2, 'days').toISOString()
        }
        const filteredSessions2 = expectedSessions.filter((session: {
            startDate: moment.MomentInput;
            endDate: moment.MomentInput
        }) => {
            return moment(session.startDate).isBetween(moment(period.startDate), moment(period.endDate))
                && moment(session.endDate).isBetween(moment(period.startDate), moment(period.endDate))
        })

        const res3 = await request(app).get("/sessions/").send(period)
        expect(res3.statusCode).toEqual(200)
        expect(res3.body.sessions).toEqual(jfy(filteredSessions2))
    })
    it('returns 400 on GET:/sessions', async () => {
        const period = {
            startDate: moment(new Date()).toISOString(),
            endDate: moment(new Date()).subtract(2, 'days').toISOString()
        }
        const perValidator = sessionOptionsValidator.validate(period)
        const res3 = await request(app).get("/sessions/").send(period)
        expect(res3.statusCode).toEqual(400)
        expect(res3.body.message).toEqual(perValidator.error?.message)
    })
    it('returns 400 on POST:/sessions', async () => {
        const validator = createCinemaSessionValidator.validate({})
        const res3 = await request(app).post("/sessions/")
        expect(res3.statusCode).toEqual(400)
        expect(res3.body.message).toEqual(validator.error?.message)
    })
    it('returns 404 and data on POST:/sessions', async () => {
        const data = {
            startDate: moment(new Date).toISOString(),
            endDate: moment(new Date).add(5, "hours").toISOString(),
            movieId: 2,
            roomId: 8523,
        }
        const res = await request(app).post("/sessions/").send(data)
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("ressource not found")
        data.roomId = 2
        data.movieId = 544554
        const res2 = await request(app).post("/sessions/").send(data)
        expect(res2.statusCode).toEqual(404)
        expect(res2.body.message).toEqual("ressource not found")
    })
    it('returns 401 while room on maintenance on POST:/sessions', async () => {
        const room = await db.room.findFirstOrThrow({where: {onMaintenance: true}})
        const data = {
            startDate: moment(new Date).toISOString(),
            endDate: moment(new Date).add(5, "hours").toISOString(),
            movieId: 2,
            roomId: room.id,
        }
        const res = await request(app).post("/sessions/").send(data)
        expect(res.statusCode).toEqual(401)
        expect(res.body.message).toEqual("Room in on maintenance. Action impossible.")
    })
    it('returns 401 while session overlap on POST:/sessions', async () => {
        const session = await db.session.findFirstOrThrow()
        const data = {
            startDate: session.startDate,
            endDate: session.endDate,
            movieId: session.movieId,
            roomId: 2,
        }
        const res = await request(app).post("/sessions/").send(data)
        expect(res.statusCode).toEqual(401)
        expect(res.body.message).toEqual("Session overlapping. Action impossible")
    })
    it('returns 201 on POST:/sessions', async () => {
        const data = {
            startDate: moment(new Date).add(4, "months").toISOString(),
            endDate: moment(new Date).add(4, "months").add(10, "second").toISOString(),
            movieId: 2,
            roomId: 2,
        }
        const res = await request(app).post("/sessions/").send(data)
        expect(res.statusCode).toEqual(201)
        expect(res.body.message).toEqual("Ressource created successfully.")
    })
    it('returns 400 on PUT:/sessions', async () => {
        const validator = updateCinemaSessionValidator.validate({})
        const res = await request(app).put("/sessions/" + 1)
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(validator.error?.message)
    })
    it('returns 404 on PUT:/sessions', async () => {
        const body = {
            movie: 1
        }
        const res = await request(app).put("/sessions/" + 99999).send(body)
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("Ressource not found")
    })
    it('returns 401 on PUT:/sessions', async () => {
        const stDate = moment(new Date).add(2, "months").toISOString()
        const enDate = moment(new Date).add(2, "months").add(10, "second").toISOString()
        const data = {
            startDate: stDate,
            endDate: enDate,
            movieId: 2,
            roomId: 2,
        }
        await request(app).post("/sessions/").send(data)
        const sess = await db.session.findFirstOrThrow({
            where: {
                startDate: stDate,
                endDate: enDate,
                movieId: 2,
                roomId: 2,
            },
            select: {
                id: true
            }
        })
        const stDate2 = moment(new Date).add(4, "months").toISOString()
        const enDate2 = moment(new Date).add(4, "months").add(10, "second").toISOString()
        const data2 = {
            startDate: stDate2,
            endDate: enDate2,
            movieId: 1,
            roomId: 3,
        }
        await request(app).post("/sessions/").send(data2)
        const mods = {
            startDate: stDate2,
            endDate: enDate2,
            movie: 1
        }
        const id = sess.id
        const res = await request(app).put("/sessions/" + id).send(mods)
        expect(res.statusCode).toEqual(401)
        expect(res.body.message).toEqual("Session overlapping. Action impossible")
    })
    it('returns 200 on PUT:/sessions', async () => {
        const stDate = moment(new Date).add(8, "months").toISOString()
        const enDate = moment(new Date).add(8, "months").add(10, "second").toISOString()
        const data = {
            startDate: stDate,
            endDate: enDate,
            movieId: 2,
            roomId: 2,
        }
        await request(app).post("/sessions/").send(data)
        const sess = await db.session.findFirstOrThrow({
            where: {
                startDate: stDate,
                endDate: enDate,
                movieId: 2,
                roomId: 2,
            },
            select: {
                id: true
            }
        })
        const id = sess.id
        const mods = {
            movie: 3,
        }
        const res = await request(app).put("/sessions/" + id).send(mods)
        expect(res.body.message).toEqual("Ressource modified successfully")
        expect(res.statusCode).toEqual(200)
        await db.session.delete({where: {id: id}})
    })
    it('returns 400 on DELETE:/sessions', async () => {
        const validator = cinemaSessionIdValidator.validate({id: "toto"})
        const res = await request(app).delete("/sessions/toto")
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(validator.error?.message)
    })
    it('returns 404 on DELETE:/sessions', async () => {
        const stDate = moment(new Date).add(4, "months").toISOString()
        const enDate = moment(new Date).add(4, "months").add(10, "second").toISOString()
        const data = {
            startDate: stDate,
            endDate: enDate,
            movieId: 2,
            roomId: 2,
        }
        await request(app).post("/sessions/").send(data)
        const sess = await db.session.findFirstOrThrow({
            where: {
                startDate: stDate,
                endDate: enDate,
                movieId: 2,
                roomId: 2,
            },
            select: {
                id: true
            }
        })
        const res = await request(app).delete("/sessions/" + 989999)
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("ressource not found")
    })
    it('returns 204 on DELETE:/sessions', async () => {
        const stDate = moment(new Date).add(4, "months").toISOString()
        const enDate = moment(new Date).add(4, "months").add(10, "second").toISOString()
        const data = {
            startDate: stDate,
            endDate: enDate,
            movieId: 2,
            roomId: 2,
        }
        await request(app).post("/sessions/").send(data)
        const sess = await db.session.findFirstOrThrow({
            where: {
                startDate: stDate,
                endDate: enDate,
                movieId: 2,
                roomId: 2,
            },
            select: {
                id: true
            }
        })
        const id = sess.id
        const res = await request(app).delete("/sessions/" + id)
        expect(res.statusCode).toEqual(204)
    })
    it('returns 400 on GET:/sessions/{id}/tickets', async () => {
        const validator = cinemaSessionIdValidator.validate({id: "hello"})
        const res = await request(app).get("/sessions/hello/tickets")
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(validator.error?.message)
    })
    it('returns 404 on GET:/sessions/{id}/tickets', async () => {
        const res = await request(app).get("/sessions/" + 99999 + "/tickets")
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("ressource not found")
    })
    it('returns 200 on GET:/sessions/{id}/tickets', async () => {
        const s = await db.session.findFirstOrThrow({
            where: {
                room: {
                    onMaintenance: false
                }
            }, include: {room: true, tickets: true, superTickets: true}
        })
        const id = s.id
        const expected = {
            remaining_tickets: s.room.seats - s.tickets.length - s.superTickets.length,
            people_on_session: s.tickets.length + s.superTickets.length
        }

        const res = await request(app).get("/sessions/" + id + "/tickets")
        expect(res.statusCode).toEqual(200)
        expect(res.body.remaining_tickets).toBe(expected.remaining_tickets)
        expect(res.body.people_on_session).toBe(expected.people_on_session)
    })
    it('returns 400 on GET:/sessions/{id}', async () => {
        const validator = cinemaSessionIdValidator.validate({id: "hello"})
        const res = await request(app).get("/sessions/hello")
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(validator.error?.message)
    })
    it('returns 404 on GET:/sessions/{id}', async () => {
        const res = await request(app).get("/sessions/" + 99999)
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("ressource not found")
        const maintenance = await db.session.findFirstOrThrow({
            where: {
                room: {
                    onMaintenance: true
                }
            }
        })
        const id = maintenance.id
        const res2 = await request(app).get("/sessions/" + id)
        expect(res2.statusCode).toEqual(404)
        expect(res2.body.message).toEqual("ressource not found")
    })
    it('returns 200 on GET:/sessions/{id}', async () => {
        const s = await db.session.findFirstOrThrow({
            where: {
                room: {
                    onMaintenance: false
                }
            }, include: {movie: true}
        })
        const id = s.id
        const res = await request(app).get("/sessions/" + id)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(jfy(s))
    })
})
