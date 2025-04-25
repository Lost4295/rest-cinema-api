import {describe, expect, it} from "@jest/globals"
import app from "../src/app"
import request from "supertest"
import {createMovieValidator, movieIdValidator, updateMovieValidator} from "../src/validators/movie"
import {PrismaClient} from '../src/db/client'
import moment from "moment";

const db = new PrismaClient()

describe('movie controller :', () => {
    it('returns all existing films on GET:/movies when data is there', async () => {
        const expectedMovies = JSON.parse(JSON.stringify((await db.movie.findMany())))
        const res = await request(app).get('/movies')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toBeDefined()
        expect(res.body.length).toEqual(expectedMovies.length)
        expect(res.body).toEqual(expectedMovies)
    })
    it('returns the selected movie on GET:/movies/{$id}', async () => {
        const movies = await db.movie.findMany()
        // transform Date object given by prisma into string
        const expectedMovie = JSON.parse(JSON.stringify(movies[2]))
        const res = await request(app).get('/movies/' + expectedMovie.id)
        expect(res.body).toEqual(expectedMovie)
        expect(res.statusCode).toEqual(200)
    })
    it('returns error when id is not number on GET:/movies/{$id}', async () => {
        const id = "test"
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).get('/movies/' + id)
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(expectedError!.error!.message)
    })
    it('returns notFound when id is invalid on GET:/movies/{$id}', async () => {
        const res = await request(app).get('/movies/' + 0xffffff)
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({"message": "ressource not found"})
    })

    it('returns the selected movie on GET:/movies/{$id} with period', async () => {
        const movies = await db.movie.findMany({
            include: {sessions: true}
        })
        const startDate = new Date()
        const endDate = new Date(moment(startDate).add('5', 'days').toISOString())
        // transform Date object given by prisma into string
        const expectedMovie = JSON.parse(JSON.stringify(movies[2]))
        expectedMovie.sessions = expectedMovie.sessions.filter((session: { startDate: Date; endDate: Date }) => {
            return moment(session.startDate).isBetween(moment(startDate), moment(endDate))
                && moment(session.endDate).isBetween(moment(startDate), moment(endDate))
        })
        const res = await request(app).get('/movies/' + expectedMovie.id).send({
            startDate: startDate,
            endDate: endDate
        })
        expect(res.body).toEqual(expectedMovie)
        expect(res.statusCode).toEqual(200)
    })


    it('returns 400 on POST:/movies with invalid data', async () => {
        const expectedErrorObject = createMovieValidator.validate({})
        const res = await request(app).post('/movies')
        expect(expectedErrorObject).toBeDefined()
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(expectedErrorObject!.error!.message)
    })
    it('returns 201 on POST:/movies with good data', async () => {
        const payload = {
            name: "Mon film !",
            duration: 50
        }
        const expectedMovieObject = createMovieValidator.validate(payload)
        const res = await request(app).post('/movies').send(payload)
        expect(expectedMovieObject.value).toBeDefined()
        expect(expectedMovieObject.error).toBeUndefined()
        expect(res.statusCode).toEqual(201)
        expect(res.body).toEqual({"message": "Ressource created successfully."})
    })
    it('returns 400 when id is not number on PUT:/movies/{$id}', async () => {
        const id = "test"
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).put('/movies/' + id)
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(expectedError!.error!.message)
    })
    it('returns 400 when data is invalid on PUT:/movies/{$id}', async () => {
        const movies = await db.movie.findMany()
        const expectedMovie = movies[2]
        const expectedError = movieIdValidator.validate({id: expectedMovie.id})
        const expectedErrorBody = updateMovieValidator.validate({})
        const res = await request(app).put('/movies/' + expectedMovie.id)
        expect(expectedError.error).toBeUndefined()
        expect(expectedError.value).toBeDefined()
        expect(expectedErrorBody.error).toBeDefined()
        expect(expectedErrorBody.value).toEqual({})
        expect(res.statusCode).toEqual(400)
        expect(res.body.message).toEqual(expectedErrorBody!.error!.message)

    })
    it('returns 404 on PUT:/movies/{$id} with invalid id ', async () => {
        const id = 0xffffff
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).put('/movies/' + id)
        expect(expectedError.error).toBeUndefined()
        expect(expectedError.value).toBeDefined()
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({"message": "ressource not found"})
    })
    it('returns 200 on PUT:/movies/{$id} wih ok data', async () => {
        const movies = await db.movie.findMany()
        const movie = movies[2]
        const movie1 = movies[1]
        const movie2 = movies[0]
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
        const res = await request(app).put('/movies/' + movie.id).send(payload)
        const res1 = await request(app).put('/movies/' + movie1.id).send(payload1)
        const res2 = await request(app).put('/movies/' + movie2.id).send(payload2)
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
        const newMovie = await request(app).get('/movies/' + movie.id)
        const newMovie1 = await request(app).get('/movies/' + movie1.id)
        const newMovie2 = await request(app).get('/movies/' + movie2.id)
        expect(newMovie.body.name).toBe(newName)
        expect(newMovie1.body.duration).toBe(newDuration)
        expect(newMovie2.body.duration).toBe(newDuration)
        expect(newMovie2.body.name).toBe(newName)

    })
    it('returns 400 when id is not number on DELETE:/movies/{$id}', async () => {
        const id = "test"
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).delete('/movies/' + id)
        expect(res.statusCode).toEqual(400)
        console.log(res.body)
        expect(res.body.message).toEqual(expectedError!.error!.message)
    })
    it('returns 404 on DELETE:/movies/{$id} with invalid id ', async () => {
        const id = 0xffffff
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).delete('/movies/' + id)
        expect(expectedError.error).toBeUndefined()
        expect(expectedError.value).toBeDefined()
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({"message": "ressource not found"})
    })
    it('returns 204 on DELETE:/movies/{$id} wih ok id', async () => {
        const expectedMovies = await db.movie.findMany()
        const movie = expectedMovies[3]
        const expectedError = movieIdValidator.validate({id: movie.id})
        const res = await request(app).delete('/movies/' + movie.id)
        expect(expectedError.error).toBeUndefined()
        expect(expectedError.value).toBeDefined()
        expect(res.statusCode).toEqual(204)
        expect(res.body).toEqual({})
        const res2 = await request(app).get('/movies/' + movie.id)
        expect(res2.statusCode).toEqual(404)
        expect(res2.body).toEqual({"message": "ressource not found"})
    })
})

