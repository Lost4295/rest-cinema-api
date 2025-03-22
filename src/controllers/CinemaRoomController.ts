import {Request, Response} from "express";
import {AppDataSource} from "../db/database";
import {CinemaRoom} from "../db/models/CinemaRoom";

export class CinemaRoomController {
    async get(req:Request, res:Response){
        const roomRepository = AppDataSource.getRepository(CinemaRoom)
        const rooms = await roomRepository.find();
        res.status(200).send(rooms)
    };
    async post(req:Request, res:Response){
        res.status(200).send("post")
    };
    async put(req:Request, res:Response){
        res.status(200).send("put")
    };
    async delete(req:Request, res:Response){
        res.status(200).send("delete")
    };
    async getOne(req:Request, res:Response){
        //TODO : add period filters

        res.status(200).send("one")
    };
}