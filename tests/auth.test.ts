import {PrismaClient} from '../src/db/client'
import {afterAll, describe, expect, test} from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import {authValidator} from "../src/validators/auth";

const db = new PrismaClient()


afterAll(async () => {
    await db.user.delete({
        where: {
            email: "new@cinema.com"
        }
    })
})


describe("auth tests", () => {
    test("login 400", async () => {
        const bodyValidator = authValidator.validate({})
        const req = await request(app).post("/auth/login").send()
        expect(req.statusCode).toBe(400)
        expect(req.body.message).toBe(bodyValidator.error?.message)

    })
    test("login 404", async () => {
        const body = {
            email: 'classique@cinema.com',
            password: 'classic'
        }
        const req = await request(app).post("/auth/login").send(body)
        expect(req.statusCode).toBe(404)
        expect(req.body.message).toBe("Invalid password or username")
    })
    test("login 401", async () => {
        const body = {
            email: 'classic@cinema.com',
            password: 'classiq'
        }
        const req = await request(app).post("/auth/login").send(body)
        expect(req.statusCode).toBe(401)
        expect(req.body.message).toBe("Invalid password or username")
    })
    test("login 200", async () => {
        const body = {
            email: 'classic@cinema.com',
            password: 'classic'
        }
        const req = await request(app).post("/auth/login").send(body)
        expect(req.statusCode).toBe(200)
        expect(req.body.token).toBeDefined()

    })
    test("register 400", async () => {
        const bodyValidator = authValidator.validate({})
        const req = await request(app).post("/auth/register").send()
        expect(req.statusCode).toBe(400)
        expect(req.body.message).toBe(bodyValidator.error?.message)

    })
    test("register 400.2", async () => {
        const body = {
            email: 'classic@cinema.com',
            password: 'classic'
        }
        const req = await request(app).post("/auth/register").send(body)
        expect(req.statusCode).toBe(400)
        expect(req.body.message).toBe("User already exists")
    })
    test("register 201", async () => {
        const body = {
            email: 'new@cinema.com',
            password: 'newUserInCinema'
        }
        const req = await request(app).post("/auth/register").send(body)
        expect(req.body.message).toBe("User created")
        expect(req.statusCode).toBe(201)

    })
    test("logout 401", async () => {
        const req = await request(app).get("/auth/logout")
        expect(req.statusCode).toBe(401)
        expect(req.body.message).toBe("Unauthorized")

    })
    test.skip("logout 403", async () => {
        const body = {
            email: 'classic@cinema.com',
            password: 'classic'
        }
        await request(app).post("/auth/login").send(body)
        const req = await request(app).get("/auth/logout")
        expect(req.statusCode).toBe(403)
        expect(req.body.message).toBe("Forbidden")

    })
    test("logout 200", async () => {
        const body = {
            email: 'classic@cinema.com',
            password: 'classic'
        }
        const requestObj = request(app)
        await requestObj.post("/auth/login").send(body)
        const req = await requestObj.get("/auth/logout")
        expect(req.statusCode).toBe(200)
        expect(req.body.message).toBe("Logged out")

    })
    test.skip("refreshToken", () => {
        //TODO finish me
    })

})

