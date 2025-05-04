import {describe, expect, it} from "@jest/globals"
import app from "../src/app"
import request from "supertest"
import {createMovieValidator, movieIdValidator, updateMovieValidator} from "../src/validators/movie"
import {PrismaClient} from '../src/db/client'
import {ticketCreateValidator} from "../src/validators/ticket";


const db = new PrismaClient()



describe('ticket controller :', () => {
    it('returns all existing films on GET:/tickets when data is there', async () => {
        const expectedTickets = await db.ticket.findMany()
        const res = await request(app).get('/tickets')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toBeDefined()
        expect(res.body.length).toEqual(expectedTickets.length)
        expect(res.body).toEqual(expectedTickets)
    })
    it('returns 400 on POST:/tickets with invalid data', async () => {
        const expectedErrorObject = createMovieValidator.validate({})
        const res = await request(app).post('/tickets')
        expect(expectedErrorObject).toBeDefined()
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual(expectedErrorObject!.error!.message)
    })
    it('returns 201 on POST:/tickets with good data', async () => {
        const payload = {
            superTicket: true
        }
        const expectedMovieObject = ticketCreateValidator.validate(payload)
        const res = await request(app).post('/tickets').send(payload)
        expect(expectedMovieObject.value).toBeDefined()
        expect(expectedMovieObject.error).toBeUndefined()
        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual({"message": "Ressource created successfully."})
    })
    it('returns 400 when id is not number on PUT:/tickets/{$id}', async () => {
        const id = "test"
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).put('/tickets/' + id)
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual(expectedError!.error!.message)
    })
    it('returns 400 when data is invalid on PUT:/tickets/{$id}', async () => {
        const tickets = await createRandomMovieData()
        const expectedMovie = tickets[2]
        const expectedError = movieIdValidator.validate({id: expectedMovie.id})
        const expectedErrorBody = updateMovieValidator.validate({})
        const res = await request(app).put('/tickets/' + expectedMovie.id)
        expect(expectedError.error).toBeUndefined()
        expect(expectedError.value).toBeDefined()
        expect(expectedErrorBody.error).toBeDefined()
        expect(expectedErrorBody.value).toEqual({})
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual(expectedErrorBody!.error!.message)

    })
    it('returns 404 on PUT:/tickets/{$id} with invalid id ', async () => {
        const id = 0xffffff
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).put('/tickets/' + id)
        expect(expectedError.error).toBeUndefined()
        expect(expectedError.value).toBeDefined()
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({"message": "ressource not found"})
    })
    it('returns 200 on PUT:/tickets/{$id} wih ok data', async () => {
        const tickets = await createRandomMovieData()
        const movie = tickets[2]
        const movie1 = tickets[1]
        const movie2 = tickets[0]
        const idValidator = movieIdValidator.validate({id: movie.id})
        const idValidator1 = movieIdValidator.validate({id: movie1.id})
        const idValidator2 = movieIdValidator.validate({id: movie2.id})
        const newName = "Nom modifié du film !"
        const newDuration = 9898
        const payload = {
            name: newName
        }
        const payload1 = {
            duration: newDuration
        }
        const payload2 = {
            name: newName,
            duration: newDuration
        }
        const bodyValidator = updateMovieValidator.validate(payload)
        const bodyValidator1 = updateMovieValidator.validate(payload1)
        const bodyValidator2 = updateMovieValidator.validate(payload2)
        const res = await request(app).put('/tickets/' + movie.id).send(payload)
        const res1 = await request(app).put('/tickets/' + movie1.id).send(payload1)
        const res2 = await request(app).put('/tickets/' + movie2.id).send(payload2)
        expect(idValidator.error).toBeUndefined()
        expect(bodyValidator.error).toBeUndefined()
        expect(idValidator1.error).toBeUndefined()
        expect(bodyValidator1.error).toBeUndefined()
        expect(idValidator2.error).toBeUndefined()
        expect(bodyValidator2.error).toBeUndefined()
        expect(idValidator.value).toBeDefined()
        expect(bodyValidator.value).toBeDefined()
        expect(idValidator1.value).toBeDefined()
        expect(bodyValidator1.value).toBeDefined()
        expect(idValidator2.value).toBeDefined()
        expect(bodyValidator2.value).toBeDefined()
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({"message": "Ressource modified successfully"})
        expect(res1.statusCode).toEqual(200)
        expect(res1.body).toEqual({"message": "Ressource modified successfully"})
        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toEqual({"message": "Ressource modified successfully"})
        const newMovie = await request(app).get('/tickets/' + movie.id)
        const newMovie1 = await request(app).get('/tickets/' + movie1.id)
        const newMovie2 = await request(app).get('/tickets/' + movie2.id)
        expect(newMovie.body.name).toBe(newName)
        expect(newMovie1.body.duration).toBe(newDuration)
        expect(newMovie2.body.duration).toBe(newDuration)
        expect(newMovie2.body.name).toBe(newName)

    }, 60000)
    it('returns 400 when id is not number on DELETE:/tickets/{$id}', async () => {
        const id = "test"
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).delete('/tickets/' + id)
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual(expectedError!.error!.message)
    })
    it('returns 404 on DELETE:/tickets/{$id} with invalid id ', async () => {
        const id = 0xffffff
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).delete('/tickets/' + id)
        expect(expectedError.error).toBeUndefined()
        expect(expectedError.value).toBeDefined()
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({"message": "ressource not found"})
    })
    it('returns 204 on DELETE:/tickets/{$id} wih ok id', async () => {
        const expectedMovies = await createRandomMovieData()
        const movie = expectedMovies[3]
        const expectedError = movieIdValidator.validate({id: movie.id})
        const res = await request(app).delete('/tickets/' + movie.id)
        expect(expectedError.error).toBeUndefined()
        expect(expectedError.value).toBeDefined()
        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
        const res2 = await request(app).get('/tickets/' + movie.id)
        expect(res2.statusCode).toEqual(404)
        expect(res2.body).toEqual({"message": "ressource not found"})
    })
})

async function createRandomMovieData() {
    const tickets = []
    for (let i = 1; i < 6; i++) {
        tickets.push({
            id: i,
            name: `Le film, partie ${i}`,
            duration: 64 + i * 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
    }
    console.log(tickets)
    await db.movie.createMany({data: tickets})
    return tickets
}
