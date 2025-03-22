import {Application, Request, Response} from "express"
import {AppDataSource} from "../db/database"
import {Movie} from "../db/models/Movie"

class MovieController {
    async get(req:Request, res:Response){
        const movieRepository = AppDataSource.getRepository(Movie)
        const movies = await movieRepository.find()
        res.status(200).send(movies)
    }
    async post(req:Request, res:Response){
        res.status(200).send("post")
    }
    async put(req:Request, res:Response){
        res.status(200).send("put")
    }
    async delete(req:Request, res:Response){
        res.status(200).send("delete")
    }

    async getOne(req:Request, res:Response){
        res.status(200).send("getOne")
    }
}

export const movieController = (app: Application) => {
    const movieController = new MovieController()
    app.get('/',movieController.get)
    app.post('/',movieController.post)
    app.put('/',movieController.put)
    app.delete('/',movieController.delete)
    app.get('/:id',movieController.getOne)
}
