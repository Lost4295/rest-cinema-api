import { Request, Response } from "express"
import { AppDataSource } from "../../db/database"
import { User } from "../../db/models/User"
export class UserController {
  async getAll(req: Request, res: Response){
    const userRepository = AppDataSource.getRepository(User)
    const users = await userRepository.find()
    res.status(200).json(users)
  }
}
