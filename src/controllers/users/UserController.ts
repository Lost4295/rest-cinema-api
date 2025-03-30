import { Request, Response } from "express"
import { AppDataSource } from "../../db/database"
import { User } from "../../db/models/User"
export class UserController {
  async getAll(req: Request, res: Response){
    try {
      const userRepository = AppDataSource.getRepository(User)
      const users = await userRepository.find()
      if (!users) {
        res.status(404).json({ message: "No users found" })
        return
      }
      res.status(200).json(users)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      res.status(500).send({ message: "Internal Server Error" })
    }
  }
}
