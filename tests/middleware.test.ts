import {afterAll, beforeAll, describe, expect, test} from "@jest/globals"
import app from "../src/app"
import request from "supertest"
import {PrismaClient} from '../src/db/client'
import {userRoles} from "../src/types/currentUser";

const db = new PrismaClient()
beforeAll(async () => {
    await db.user.createMany({
        data: [
            {
                email: `classic@cinema.com`,
                password: `classic`,
                roles: userRoles.CLASSIC,
            },
            {
                email: `accueil@cinema.com`,
                password: `accueil`,
                roles: userRoles.ACCUEIL,
            },
            {
                email: `projectionist@cinema.com`,
                password: `projectionist`,
                roles: userRoles.PROJECTIONIST,
            },
            {
                email: `confisery@cinema.com`,
                password: `confisery`,
                roles: userRoles.CONFISERY,
            },
            {
                email: `admin@cinema.com`,
                password: `admin`,
                roles: userRoles.ADMIN,
            },
            {
                email: `super_admin@cinema.com`,
                password: `super_admin`,
                roles: userRoles.SUPER_ADMIN,
            },
        ]
    })
})

afterAll(async () => {
    await db.user.deleteMany({
        where: {
            OR: [
                {email: `classic@cinema.com`},
                {email: `accueil@cinema.com`},
                {email: `projectionist@cinema.com`},
                {email: `confisery@cinema.com`},
                {email: `admin@cinema.com`},
                {email: `super_admin@cinema.com`},
            ]
        }
    })

})

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
        //todo : auth M4THIA5
        const res2 = await request(app).get("/test-classic")
        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toBeDefined()
        expect(res2.body.message).toBe("ok")
    })
    test("/test-employee", async () => {
        const res = await request(app).get("/test-employee")
        expect(res.statusCode).toEqual(401)
        expect(res.body).toBeDefined()
        expect(res.body.message).toBe("Unauthorized")
        //todo : auth M4THIA5
        const res2 = await request(app).get("/test-employee")
        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toBeDefined()
        expect(res2.body.message).toBe("ok")
    })
    test("/test-admin", async () => {
        const res = await request(app).get("/test-admin")
        expect(res.statusCode).toEqual(401)
        expect(res.body).toBeDefined()
        expect(res.body.message).toBe("Unauthorized")
        //todo : auth M4THIA5
        const res2 = await request(app).get("/test-admin")
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
        const res2 = await request(app).get("/test-super-admin")
        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toBeDefined()
        expect(res2.body.message).toBe("ok")
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
