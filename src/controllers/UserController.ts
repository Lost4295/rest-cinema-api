import { Request, Response } from "express"
import { AppDataSource } from "../db/database"
import { User, UserRoles, userRoles } from "../db/models/User"
import { createUserWithRoleValidator, updatePasswordValidator, userIdValidator } from "../validators/user"
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

  async createUserWithRole(req: Request, res: Response) {
    try {
      const bodyValidator = createUserWithRoleValidator.validate(req.body)
      if (bodyValidator.error !== undefined) {
        res.status(400).json(bodyValidator.error.details)
        return
      }
      const body = bodyValidator.value
      const userRepository = AppDataSource.getRepository(User)
      await userRepository.save(body)
      res.status(201).json({ message: "User created successfully" })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      res.status(500).send({ message: "Internal Server Error" })
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const currentUser = (req as any).user
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" })
        return
      }
      const idValidator = userIdValidator.validate({ id: parseInt(currentUser.id)})
      if (idValidator.error) {
        res.status(400).json(idValidator.error.details)
        return
      }
      const id = idValidator.value.id

      const bodyValidator = updatePasswordValidator.validate(req.body)
      if (bodyValidator.error !== undefined) {
        res.status(400).json(bodyValidator.error.details)
        return
      }

      const body = bodyValidator.value
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOneBy({ id: id.value.id })
      if (!user) {
        res.status(404).json({ message: "User not found" })
        return
      }
      if (user.password !== body.oldPassword) {
        res.status(401).json({ message: "Old password is incorrect" })
        return
      }
      user.password = body.newPassword
      await userRepository.save(user)
      res.status(200).json({ message: "Password updated successfully" })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      res.status(500).send({ message: "Internal Server Error" })
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const idValidator = userIdValidator.validate(parseInt(req.params.id))
      if (idValidator.error) {
        res.status(400).json(idValidator.error.details)
        return
      }
      const id = idValidator.value.id

      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOneBy({ id })
      
      const currentUser = (req as any).user

      if (!user || !canDeleteUser(user.role, currentUser.role)) {
        res.status(404).json({ message: "User not found" })
        return
      }

      await userRepository.delete(id)
      res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      res.status(500).send({ message: "Internal Server Error" })
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const currentUser = (req as any).user
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" })
        return
      }
      const idValidator = userIdValidator.validate({ id: parseInt(currentUser.id) })
      if (idValidator.error) {
        res.status(400).json(idValidator.error.details)
        return
      }
      const id = idValidator.value.id
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOneBy({ id })
      if (!user) {
        res.status(404).json({ message: "User not found" })
        return
      }

      const { password, ...userWithoutPassword } = user
      res.status(200).json(userWithoutPassword)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      res.status(500).send({ message: "Internal Server Error" })
    }
  }
}


const canDeleteUser = (userRole: UserRoles, currentUserRole: UserRoles): boolean => {
  if (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN) {
    return currentUserRole === userRoles.SUPER_ADMIN
  }
  return true
}
