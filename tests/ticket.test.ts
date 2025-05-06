import {describe, expect, it} from "@jest/globals"
import app from "../src/app"
import request from "supertest"
import {PrismaClient} from '../src/db/client'
import {
    ticketCreateValidator,
    ticketIdValidator,
    ticketUpdateValidator,
    ticketUseValidator
} from "../src/validators/ticket";


const db = new PrismaClient()

describe('ticket controller :', () => {
    it('200 on GET:/', async () => {
        const tickets = await db.ticket.findMany({})
        const res = await request(app).get("/tickets/")
        expect(res.statusCode).toEqual(200)
        expect(res.body.tickets).toEqual(tickets)
    })
    it.skip('400 on GET:/me', async () => {
        const res = await request(app).get("/tickets/")
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("")
    })
    it.skip('200 on GET:/me', async () => {
        const res = await request(app).get("/tickets/")
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("")
    })
    it('400 on POST:/', async () => {
        const val = ticketCreateValidator.validate({})
        const res = await request(app).post("/tickets/")
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(val.error?.message)
    })
    it.skip('400.2 on POST:/', async () => {
        const res = await request(app).post("/tickets/")
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual("")
    })
    it.skip('201 on POST:/', async () => {
        const res = await request(app).post("/tickets/").send({superTicket: false})
        expect(res.statusCode).toEqual(201)
        expect(res.body.message).toEqual("")
        const res2 = await request(app).post("/tickets/").send({superTicket: true})
        expect(res2.statusCode).toEqual(201)
        expect(res2.body.message).toEqual("")
    })
    it('400 on PUT:/:id', async () => {
        const val = ticketIdValidator.validate({id: "fgydfvhg"})
        const res = await request(app).put("/tickets/fgydfvhg")
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(val.error?.message)
    })
    it('404 on PUT:/:id', async () => {
        const res = await request(app).put("/tickets/" + 999999)
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("ressource not found")
    })
    it('400.2 on PUT:/:id', async () => {
        const val = ticketUpdateValidator.validate({})
        const ticket = await db.ticket.findFirstOrThrow()
        const id = ticket.id
        const res = await request(app).put("/tickets/" + id)
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(val.error?.message)
        const ticket2 = await db.superTicket.findFirstOrThrow()
        const id2 = ticket2.id
        const res2 = await request(app).put("/tickets/" + id2)
        expect(res2.statusCode).toEqual(400)
        expect(res2.body.message).toEqual(val.error?.message)
    })
    it('200 on PUT:/:id', async () => {
        const val = {
            sessionId: 5
        }
        const ticket = await db.ticket.findFirstOrThrow()
        const id = ticket.id
        const res = await request(app).put("/tickets/" + id).send(val)
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("Ressource modified successfully")
        const ticket2 = await db.ticket.findFirstOrThrow()
        const id2 = ticket2.id
        const res2 = await request(app).put("/tickets/" + id2).send(val)
        expect(res2.statusCode).toEqual(200)
        expect(res2.body.message).toEqual("Ressource modified successfully")
    })
    it('400 on DELETE:/:id', async () => {
        const val = ticketIdValidator.validate({"id": "okijuhgy"})
        const res = await request(app).delete("/tickets/okijuhgy")
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(val.error?.message)
    })
    it('404 on DELETE:/:id', async () => {
        const res = await request(app).delete("/tickets/" + 4)
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("ressource not found")
        const res2 = await request(app).delete("/tickets/" + 9999999)
        expect(res2.statusCode).toEqual(404)
        expect(res2.body.message).toEqual("ressource not found")
    })
    it.skip('204 on DELETE:/:id', async () => {
        const res = await request(app).delete("/tickets/")
        expect(res.statusCode).toEqual(204)
        expect(res.body.message).toEqual("")
    })
    it.skip('400 on GET:/:id', async () => {
        const validator = ticketIdValidator.validate({id: "yutfghuyt"})
        const res = await request(app).get("/tickets/yutfghuyt")
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(validator.error?.message)
        const id = 0
        const validator2 = ticketUseValidator.validate({})
        const res2 = await request(app).get("/tickets/" + id)
        expect(res2.statusCode).toEqual(400)
        expect(res2.body.message).toEqual(validator2.error?.message)
    })
    it.skip('404 on GET:/:id', async () => {
        const res = await request(app).get("/tickets/")
        expect(res.statusCode).toEqual(404)
        expect(res.body.message).toEqual("")
    })
    it.skip('200 on GET:/:id', async () => {
        const res = await request(app).get("/tickets/")
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("")
    })
})
