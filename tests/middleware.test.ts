import {describe, expect, test} from "@jest/globals"
import app from "../src/app"
import request from "supertest"
import {PrismaClient} from '../src/db/client'
import {userRoles} from "../src/types/currentUser"

const db = new PrismaClient()

describe("middleware tests", () => {
    test("/", async () => {
        const res = await request(app).get("/")
        expect(res.statusCode).toEqual(200)
        expect(res.body).toBeDefined()
        expect(res.body.message).toBe("ok")
    })
    test("/test-classic", async () => {
        const res = await request(app).get("/test-classic")
        expect(res.statusCode).toEqual(401)
        expect(res.body).toBeDefined()
        expect(res.body.message).toBe("Unauthorized")
        const body = {
            email: "classic@cinema.com",
            password: "classic"
        }
        const toke = await request(app).post("/auth/login").send(body)
        const token = toke.body.token

        const res2 = await request(app).get("/test-classic").auth(token, {type: "bearer"})
        expect(res2.body.message).toBe("ok")
        expect(res2.body).toBeDefined()
        expect(res2.statusCode).toEqual(200)
    })
    test("/test-employee", async () => {
        const res = await request(app).get("/test-employee")
        expect(res.statusCode).toEqual(401)
        expect(res.body).toBeDefined()
        expect(res.body.message).toBe("Unauthorized")
        let body = {
            email: "accueil@cinema.com",
            password: "accueil"
        }
        let toke = await request(app).post("/auth/login").send(body)
        expect(toke.statusCode).toEqual(200)
        let token = toke.body.token
        let res2 = await request(app).get("/test-employee").auth(token, {type: "bearer"})
        expect(res2.body.message).toBe("ok")
        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toBeDefined()
        body = {
            email: "confisery@cinema.com",
            password: "confisery"
        }
        toke = await request(app).post("/auth/login").send(body)
        expect(toke.statusCode).toEqual(200)
        token = toke.body.token
        res2 = await request(app).get("/test-employee").auth(token, {type: "bearer"})
        expect(res2.body.message).toBe("ok")
        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toBeDefined()
        body = {
            email: "projectionist@cinema.com",
            password: "projectionist"
        }
        toke = await request(app).post("/auth/login").send(body)
        expect(toke.statusCode).toEqual(200)
        token = toke.body.token
        res2 = await request(app).get("/test-employee").auth(token, {type: "bearer"})
        expect(res2.body.message).toBe("ok")
        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toBeDefined()
    })
    test("/test-admin", async () => {
        const res = await request(app).get("/test-admin")
        expect(res.statusCode).toEqual(401)
        expect(res.body).toBeDefined()
        expect(res.body.message).toBe("Unauthorized")
        //todo : auth M4THIA5
        const body = {
            email: "admin@cinema.com",
            password: "admin1234"
        }
        const toke = await request(app).post("/auth/login").send(body)
        const token = toke.body.token
        const res2 = await request(app).get("/test-admin").auth(token, {type: "bearer"})
        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toBeDefined()
        expect(res2.body.message).toBe("ok")
    })
    test("/test-super-admin", async () => {
        const res = await request(app).get("/test-super-admin")
        expect(res.statusCode).toEqual(401)
        expect(res.body).toBeDefined()
        expect(res.body.message).toBe("Unauthorized")
        //todo : auth M4THIA5
        const body = {
            email: "super_admin@cinema.com",
            password: "super_admin"
        }
        const toke = await request(app).post("/auth/login").send(body)
        const token = toke.body.token
        const res2 = await request(app).get("/test-super-admin").auth(token, {type: "bearer"})
        expect(res2.statusCode).toEqual(200)
        expect(res2.body.message).toBe("ok")
        expect(res2.body).toBeDefined()
    })
    test("/test-is-open", async () => {
        const res = await request(app).get("/test-is-open")
        const hour = new Date().getHours()
        if (9 < hour && hour < 20) {
            expect(res.statusCode).toEqual(200)
            expect(res.body).toBeDefined()
            expect(res.body.message).toBe("ok")
        } else {
            expect(res.statusCode).toEqual(403)
            expect(res.body).toBeDefined()
            expect(res.body.message).toBe("Forbidden : cinema is closed")
        }

    })
    test("/test-can-open", async () => {
        const res = await request(app).get("/test-can-open")
        expect(res.statusCode).toEqual(200)
        expect(res.body).toBeDefined()
        expect(res.body.message).toBe("ok")
        await db.user.deleteMany({where: {roles: userRoles.CONFISERY}})
        const res2 = await request(app).get("/test-can-open")
        expect(res2.statusCode).toEqual(403)
        expect(res2.body).toBeDefined()
        expect(res2.body.message).toBe("Forbidden : cinema is closed")
    })
})
