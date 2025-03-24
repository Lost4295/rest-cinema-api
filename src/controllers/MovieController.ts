import {Request, Response} from "express"
import {AppDataSource} from "../db/database"
import {Movie} from "../db/models/Movie"
import {createMovieValidator, updateMovieValidator} from "../validators/movie";

export class MovieController {
    async get(req:Request, res:Response){
        const movieRepository = AppDataSource.getRepository(Movie)
        const movies = await movieRepository.find()
        res.status(200).send(movies)
    }
    async post(req:Request, res:Response){
        const bodyValidator = createMovieValidator.validate(req.body)
        if (bodyValidator.error!==undefined){
            console.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
            return;
        }
        const body = bodyValidator.value
        const movieRepository = AppDataSource.getRepository(Movie)
        await movieRepository.save(body)
        res.status(201).send({"message":"Ressource created successfully."})
    }
    async put(req:Request, res:Response){
        const bodyValidator = updateMovieValidator.validate(req.body)
        if (bodyValidator.error!==undefined){
            console.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
            return;
        }
        const body = bodyValidator.value
        const movieRepository = AppDataSource.getRepository(Movie)
        const movie = await movieRepository.findOneBy({
            id: body.id
        })
        if (!movie){
            res.status(404).send({"message":"ressource not found"})
        }
        await movieRepository.save(body)
        res.status(200).send({"message":"Resspource modified successfully"})
    }
    async delete(req:Request, res:Response){
        res.status(200).send("delete")
    }

    async getOne(req:Request, res:Response){
        res.status(200).send("getOne")
    }
}
