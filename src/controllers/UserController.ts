import {Request, Response} from "express"
import {UserRoles, userRoles} from "../types/currentUser"
import {PrismaClient} from '../db/client'
import {
    createUserWithRoleValidator,
    creditMoneyValidator,
    debiteMoneyValidator,
    updatePasswordValidator,
    userIdValidator
} from "../validators/user"
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

    async creditMoney(req: Request, res: Response) {
        try {
            const currentUser = (req as any).user
            if (!currentUser) {
                res.status(401).json({message: "Unauthorized"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request fail : Unauthorized'}))
                return
            }
            const idValidator = userIdValidator.validate({id: parseInt(currentUser.id)})
            if (idValidator.error) {
                res.status(400).json(idValidator.error.details)
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request fail : validation error'}))
                return
            }
            const id = idValidator.value.id

            const bodyValidator = creditMoneyValidator.validate(req.body)
            if (bodyValidator.error !== undefined) {
                res.status(400).json(bodyValidator.error.details)
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request fail : validation error'}))
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
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request fail : User not found'}))
                return
            }


            user.money = user.money + body.credit
            await db.user.update({data: user, where: {id: id.value.id}})

            await db.transaction.create({
                data: {
                    userId: user.id,
                    date: new Date(),
                    price: body.credit,
                    superTicketId: undefined,
                    ticketId: undefined,
                    isCredit: true,
                }
            })

            res.status(200).json({message: "Password updated successfully"})
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request : success'}))
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            res.status(500).send({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request fail : Internal Server Error'}))
        }
    }

    async debiteMoney(req: Request, res: Response) {
        try {
            const currentUser = (req as any).user
            if (!currentUser) {
                res.status(401).json({message: "Unauthorized"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request fail : Unauthorized'}))
                return
            }
            const idValidator = userIdValidator.validate({id: parseInt(currentUser.id)})
            if (idValidator.error) {
                res.status(400).json(idValidator.error.details)
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request fail : validation error'}))
                return
            }
            const id = idValidator.value.id

            const bodyValidator = debiteMoneyValidator.validate(req.body)
            if (bodyValidator.error !== undefined) {
                res.status(400).json(bodyValidator.error.details)
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request fail : validation error'}))
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
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request fail : User not found'}))
                return
            }

            user.money = user.money - body.debite
            await db.user.update({data: user, where: {id: id.value.id}})

            await db.transaction.create({
                data: {
                    userId: user.id,
                    date: new Date(),
                    price: body.credit,
                    superTicketId: undefined,
                    ticketId: undefined,
                    isCredit: false,
                }
            })

            res.status(200).json({message: "Password updated successfully"})
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request : success'}))
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            res.status(500).send({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'AddMoney request fail : Internal Server Error'}))
        }
    }

    async getAllTransaction(req: Request, res: Response) {
        try {
            const transactions = await db.transaction.findMany()
            if (!transactions) {
                res.status(404).json({message: "No transactions found"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'getAllTransaction request fail : No transactions found'}))
                return
            }

            res.status(200).json(transactions)
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'getAllTransaction request : success'}))
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            res.status(500).send({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'getAllTransaction request fail : Internal Server Error'}))
        }
    }


    async getMyTransaction(req: Request, res: Response) {
        try {
            const currentUser = (req as any).user
            if (!currentUser) {
                res.status(401).json({message: "Unauthorized"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'getMyTransaction request fail : Unauthorized'}))
                return
            }
            const idValidator = userIdValidator.validate({id: parseInt(currentUser.id)})
            if (idValidator.error) {
                res.status(400).json(idValidator.error.details)
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'GetProfileController request fail : validation error'}))
                return
            }
            const id = idValidator.value.id

            const transactions = await db.transaction.findMany({
                where: {
                    userId: id
                }
            })
            if (!transactions) {
                res.status(404).json({message: "Transactions not found"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'getMyTransaction request fail : Transactions not found'}))
                return
            }

            res.status(200).json(transactions)
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'getMyTransaction request : success'}))
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            res.status(500).send({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'getMyTransaction request fail : Internal Server Error'}))
        }
    }

    async getAllUserUsedAPi(req: Request, res: Response) {
        try {
            const users = await db.user.findMany({
                where: {
                    requestsDone: {
                        gt: 0
                    }
                },
                select: {
                    email: true,
                    requestsDone: true,
                    lastAPIUsage: true,
                }
            })
            if (!users) {
                res.status(404).json({message: "No users found"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'UserController.getAllUserUsedAPi request fail : No users found'}))
                return
            }

            res.status(200).json(users)
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'UserController.getAllUserUsedAPi request : success'}))
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            res.status(500).send({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'UserController.getAllUserUsedAPi request fail : Internal Server Error'}))
        }
    }


    async getUserDetailsAndActivity(req: Request, res: Response) {
        try {
            const idValidator = userIdValidator.validate(req.params)
            if (idValidator.error) {
                res.status(400).json(idValidator.error.message)
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'UserController.getUserDetailsAndActivity request fail : validation error'}))
                return
            }
            const id = idValidator.value.id

            const user = await db.user.findUnique({
                where: {
                    id: id
                }
            })

            if (!user) {
                res.status(404).json({message: "No user found"})
                logger.error(formatHTTPLoggerResponse(req, res, {message: 'UserController.getUserDetailsAndActivity request fail : No user found'}))
                return
            }

            const listTicketUser = await db.ticket.findMany({
                where: {
                    userId: user.id
                }
            })

            const sessionIds = new Set()
            const listParticipatedSessions = []
            for (const t of listTicketUser) {
                if (!sessionIds.has(t.sessionId)) {
                    const session = await db.session.findUnique({
                        where: {
                            id: t.sessionId
                        },
                        include: {
                            movie: true
                        }
                    })
                    if (session) {
                        listParticipatedSessions.push(session)
                        sessionIds.add(t.sessionId)
                    }
                }
            }

            const listSuperTicketUser = await db.superTicket.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    session: true,
                }
            })
            for (const t of listSuperTicketUser) {
                for (const s of t.session) {
                    if (!sessionIds.has(s.id)) {
                        listParticipatedSessions.push(s)
                    }
                }
            }
            const list: number[] = []
            for (const p of listParticipatedSessions) {
                if (!list.includes(p.movieId)) {
                    list.push(p.movieId)
                }
            }
            const MovieSee = await db.movie.findMany({
                where: {
                    id: {in: list}
                },
            })
            const {password, ...userWithoutPassword} = user
            const dict = {
                user: userWithoutPassword,
                activity: listParticipatedSessions,
                movies: MovieSee
            }

            res.status(200).json(dict)
            logger.info(formatHTTPLoggerResponse(req, res, {message: 'getUserDetailsAndActivity request : success'}))


        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            res.status(500).send({message: "Internal Server Error"})
            logger.error(formatHTTPLoggerResponse(req, res, {message: 'getUserDetailsAndActivity request fail : Internal Server Error'}))
        }
    }
}


const canDeleteUser = (userRole: UserRoles, currentUserRole: UserRoles): boolean => {
    if (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN) {
        return currentUserRole === userRoles.SUPER_ADMIN
    }
    return true
}
