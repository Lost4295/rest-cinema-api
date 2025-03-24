import {Request, Response} from "express"
import {AppDataSource} from "../db/database"
import {CinemaRoom} from "../db/models/CinemaRoom"
import {createCinemaRoomValidator,updateCinemaRoomValidator} from "../validators/rooms";


export class CinemaRoomController {
    async get(req:Request, res:Response){
        const roomRepository = AppDataSource.getRepository(CinemaRoom)
        const rooms = await roomRepository.find()
        res.status(200).send(rooms)
    }
    async post(req:Request, res:Response){
        const bodyValidator = createCinemaRoomValidator.validate(req.body)
        if (bodyValidator.error!==undefined){
            console.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
            return;
        }
        const body = bodyValidator.value
        const roomRepository = AppDataSource.getRepository(CinemaRoom)
        await roomRepository.save(body)
        res.status(201).send({"message":"Ressource created successfully."})
    }
    async put(req:Request, res:Response){
        const bodyValidator = updateCinemaRoomValidator.validate(req.body)
        if (bodyValidator.error!==undefined){
            console.error(bodyValidator.error)
            res.status(400).send(bodyValidator.error.details)
            return;
        }
        const body = bodyValidator.value
        const roomRepository = AppDataSource.getRepository(CinemaRoom)
        const room = await roomRepository.findOneBy({
            id: body.id
        })
        if (!room){
            res.status(404).send({"message":"ressource not found"})
        }
        await roomRepository.save(body)
        res.status(200).send({"message":"Ressource modified successfully"})
    }
    async delete(req:Request, res:Response){
        res.status(200).send("delete")
    }
    async getOne(req:Request, res:Response){
        //TODO : add period filters

        res.status(200).send("one")
    }
}
