import {afterEach, beforeAll, beforeEach, describe, expect, it} from "@jest/globals"
import app from "../src/app"
import request from "supertest"
import {AppDataSource} from "../src/db/database"
import {Movie} from "../src/db/models/Movie"
import {createMovieValidator, movieIdValidator, updateMovieValidator} from "../src/validators/movie"
import {cleanDB} from "./utils"


beforeAll(async () => {
    await AppDataSource.initialize()
    await cleanDB()
})

beforeEach(async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize()
    }
})
afterEach(async () => await cleanDB())


describe('movie controller :', () => {
    it('returns nothing on GET:/movies when no data is there', async () => {
        try {


        const res = await request(app).get('/movies')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual([])
        } catch (e) {
            console.log(e)
        }
    })
    it('returns all existing films on GET:/movies when data is there', async () => {
        try {


        const expectedMovies = await createRandomMovieData()
        const res = await request(app).get('/movies')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(expectedMovies)
        } catch (e) {
            console.log(e)
        }
    })
    it('returns the selected movie on GET:/movies/{$id}', async () => {
        try {


        const movies = await createRandomMovieData()
        const expectedMovie = movies[2]
        const res = await request(app).get('/movies/' + expectedMovie.id)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(expectedMovie)
        } catch (e) {
            console.log(e)
        }
    })
    it('returns error when id is not number on GET:/movies/{$id}', async () => {
        try {


        const id = "test"
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).get('/movies/' + id)
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual(expectedError!.error!.details)
        } catch (e) {
            console.log(e)
        }
    })
    it('returns notFound when id is invalid on GET:/movies/{$id}', async () => {
        try {


        const res = await request(app).get('/movies/' + 0xffffff)
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({"message": "ressource not found"})
        } catch (e) {
            console.log(e)
        }
    })
    //TODO : test GET:/movies/{id} with period
    it('returns 400 on POST:/movies with invalid data', async () => {
        try {


        const expectedErrorObject = createMovieValidator.validate({})
        const res = await request(app).post('/movies')
        expect(expectedErrorObject).toBeDefined()
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual(expectedErrorObject!.error!.details)
        } catch (e) {
            console.log(e)
        }
    })
    it('returns 201 on POST:/movies with good data', async () => {
        try {


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
        } catch (e) {
            console.log(e)
        }
    })
    it('returns 400 when id is not number on PUT:/movies/{$id}', async () => {
        try {


        const id = "test"
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).put('/movies/' + id)
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual(expectedError!.error!.details)
        } catch (e) {
            console.log(e)
        }
    })
    it('returns 400 when data is invalid on PUT:/movies/{$id}', async () => {
        try {


        const movies = await createRandomMovieData()
        const expectedMovie = movies[2]
        const expectedError = movieIdValidator.validate({id: expectedMovie.id})
        const expectedErrorBody = updateMovieValidator.validate({})
        const res = await request(app).put('/movies/' + expectedMovie.id)
        expect(expectedError.error).toBeUndefined()
        expect(expectedError.value).toBeDefined()
        expect(expectedErrorBody.error).toBeDefined()
        expect(expectedErrorBody.value).toEqual({})
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual(expectedErrorBody!.error!.details)

        } catch (e) {
            console.log(e)
        }
    })
    it('returns 404 on PUT:/movies/{$id} with invalid id ', async () => {
        try {


        const id = 0xffffff
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).put('/movies/' + id)
        expect(expectedError.error).toBeUndefined()
        expect(expectedError.value).toBeDefined()
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({"message": "ressource not found"})
        } catch (e) {
            console.log(e)
        }
    })
    it('returns 200 on PUT:/movies/{$id} wih ok data', async () => {
        try {


        const movies = await createRandomMovieData()
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

        } catch (e) {
        }
    }, 60000)
    it('returns 400 when id is not number on DELETE:/movies/{$id}', async () => {
        try {


        const id = "test"
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).delete('/movies/' + id)
        expect(res.statusCode).toEqual(400)
        expect(res.body).toEqual(expectedError!.error!.details)
        } catch (e) {
            console.log(e)
        }
    })
    it('returns 404 on DELETE:/movies/{$id} with invalid id ', async () => {
        try {


        const id = 0xffffff
        const expectedError = movieIdValidator.validate({id: id})
        const res = await request(app).delete('/movies/' + id)
        expect(expectedError.error).toBeUndefined()
        expect(expectedError.value).toBeDefined()
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({"message": "ressource not found"})
        } catch (e) {
            console.log(e)
        }
    })
    it('returns 204 on DELETE:/movies/{$id} wih ok id', async () => {
        try {


        const expectedMovies = await createRandomMovieData()
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
        } catch (e) {
            console.log(e)
        }
    })
})

async function createRandomMovieData() {
    const mo = AppDataSource.getRepository(Movie)
    const movies = []
    for (let i = 1; i < 6; i++) {
        movies.push(new Movie(i, `Le film, partie ${i}`, 64 + i * 3))
    }
    await mo.save(movies)
    return movies
}
