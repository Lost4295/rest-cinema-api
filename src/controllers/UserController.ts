import {Request, Response} from "express"
import {UserRoles, userRoles} from "../types/currentUser"
import {PrismaClient} from '../db/client'
import {createUserWithRoleValidator, updatePasswordValidator, userIdValidator} from "../validators/user"
import formatHTTPLoggerResponse from "../loggerformat"
import {logger} from "../format"

const db = new PrismaClient()

export class UserController {
    async getAll(req: Request, res: Response) {
        try {
            const users = await db.user.findMany()
            if (!users) {
                res.status(404).json({message: "No users found"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'GetAllUserController request fail : No users found'}))
                return
            }
            res.status(200).json(users)
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'GetAllUserController request : success'}))
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            res.status(500).send({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'GetAllUserController request fail : Internal Server Error'}))
        }
    }

    async createUserWithRole(req: Request, res: Response) {
        try {
            const bodyValidator = createUserWithRoleValidator.validate(req.body)
            if (bodyValidator.error !== undefined) {
                res.status(400).json(bodyValidator.error.message)
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'CreateUserWithRoleController request fail : validation error'}))
                return
            }
            const body = bodyValidator.value
            await db.user.create({data: body})
            res.status(201).json({message: "User created successfully"})
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'CreateUserWithRoleController request : success'}))
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            res.status(500).send({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'CreateUserWithRoleController request fail : Internal Server Error'}))
        }
    }

    async updatePassword(req: Request, res: Response) {
        try {
            const currentUser = (req as any).user
            if (!currentUser) {
                res.status(401).json({message: "Unauthorized"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'UpdatePasswordController request fail : Unauthorized'}))
                return
            }
            const idValidator = userIdValidator.validate({id: parseInt(currentUser.id)})
            if (idValidator.error) {
                res.status(400).json(idValidator.error.message)
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'UpdatePasswordController request fail : validation error'}))
                return
            }
            const id = idValidator.value.id

            const bodyValidator = updatePasswordValidator.validate(req.body)
            if (bodyValidator.error !== undefined) {
                res.status(400).json(bodyValidator.error.message)
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'UpdatePasswordController request fail : validation error'}))
                return
            }

            const body = bodyValidator.value
            const user = await db.user.findUnique({
                where: {
                    id: id.value.id
                }
            })
            if (!user) {
                res.status(404).json({message: "User not found"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'UpdatePasswordController request fail : User not found'}))
                return
            }
            if (user.password !== body.oldPassword) {
                res.status(401).json({message: "Old password is incorrect"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'UpdatePasswordController request fail : Old password is incorrect'}))
                return
            }
            user.password = body.newPassword
            await db.user.update({data: user, where: {id: id.value.id}})
            res.status(200).json({message: "Password updated successfully"})
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'UpdatePasswordController request : success'}))
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            res.status(500).send({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'UpdatePasswordController request fail : Internal Server Error'}))
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const idValidator = userIdValidator.validate(parseInt(req.params.id))
            if (idValidator.error) {
                res.status(400).json(idValidator.error.message)
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'DeleteUserController request fail : validation error'}))
                return
            }
            const id = idValidator.value.id

            const user = await db.user.findUnique({
                where: {
                    id: id
                }
            })

            const currentUser = (req as any).user

            if (!user || !canDeleteUser(user.roles as UserRoles, currentUser.role)) {
                res.status(404).json({message: "User not found"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'DeleteUserController request fail : User not found'}))
                return
            }

            await db.user.delete({
                where: {
                    id: id
                }
            })
            res.status(200).json({message: "User deleted successfully"})
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'DeleteUserController request : success'}))
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            res.status(500).send({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'DeleteUserController request fail : Internal Server Error'}))
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const currentUser = (req as any).user
            if (!currentUser) {
                res.status(401).json({message: "Unauthorized"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'GetProfileController request fail : Unauthorized'}))
                return
            }
            const idValidator = userIdValidator.validate({id: parseInt(currentUser.id)})
            if (idValidator.error) {
                res.status(400).json(idValidator.error.message)
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'GetProfileController request fail : validation error'}))
                return
            }
            const id = idValidator.value.id
            const user = await db.user.findUnique({
                where: {
                    id: id
                }
            })
            if (!user) {
                res.status(404).json({message: "User not found"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'GetProfileController request fail : User not found'}))
                return
            }

            const {password, ...userWithoutPassword} = user
            res.status(200).json(userWithoutPassword)
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'GetProfileController request : success'}))
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            res.status(500).send({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'GetProfileController request fail : Internal Server Error'}))
        }
    }
}


const canDeleteUser = (userRole: UserRoles, currentUserRole: UserRoles): boolean => {
    if (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN) {
        return currentUserRole === userRoles.SUPER_ADMIN
    }
    return true
}
