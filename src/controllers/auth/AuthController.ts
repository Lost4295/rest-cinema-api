import {Request, Response} from "express"
import {PrismaClient} from '../../db/client/'
import {authValidator} from "../../validators/auth"
import bcrypt from "bcrypt"
import {config} from "../../config/config"
import {sign} from "jsonwebtoken"
import {CurrentUser, UserRoles, userRoles} from "../../types/currentUser"

const accessTokenExpiration = config.env === "production" ? '30s' : '1d'
const refreshTokenExpiration = '7d'
const accessTokenSecret = config.accessTokenSecret
const refreshTokenSecret = config.refreshTokenSecret

const db = new PrismaClient()

export class AuthController {
    async login(req: Request, res: Response) {
        const bodyValidator = authValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            console.error(bodyValidator.error)
            res.status(400).json(bodyValidator.error.details)
            return
        }
        const body = bodyValidator.value
        const user = await db.user.findUnique({where: {email: body.email}})
        if (!user) {
            res.status(404).json({message: "User not found"})
            return
        }
        const isPasswordCorrect = await bcrypt.compare(body.password, user.password)
        if (!isPasswordCorrect) {
            res.status(401).json({message: "Invalid password"})
            return
        }
        const currentUser: CurrentUser = {
            id: user.id,
            email: user.email,
            role: user.roles as UserRoles,
        }

        const accessToken = sign(currentUser, accessTokenSecret, {
            expiresIn: accessTokenExpiration
        })

        const refreshToken = sign(currentUser, refreshTokenSecret, {
            expiresIn: refreshTokenExpiration
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: config.env === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        await db.token.create({
            data: {
                token: refreshToken,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })


        res.status(200).json({accessToken})

    }

    async register(req: Request, res: Response) {
        const bodyValidator = authValidator.validate(req.body)
        if (bodyValidator.error !== undefined) {
            console.error(bodyValidator.error)
            res.status(400).json(bodyValidator.error.details)
            return
        }
        const body = bodyValidator.value
        const user = await db.user.findUnique({where: {email: body.email}})
        if (user) {
            res.status(400).json({message: "User already exists"})
            return
        }
        const hashedPassword = await bcrypt.hash(body.password, 10)
        const newUser = {
            email: body.email,
            password: hashedPassword,
            roles: userRoles.CLASSIC,
        }
        await db.user.create({data: newUser})

        res.status(201).json({message: "User created"})
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            res.status(401).json({message: "Unauthorized"})
            return
        }
        const token = await db.token.findUnique({where: {token: refreshToken}})

        if (!token) {
            res.status(403).json({message: "Forbidden"})
            return
        }

        await db.token.delete({where: {id: token.id}})
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: config.env === "production",
            sameSite: "strict"
        })

        res.status(200).json({message: "Logged out"})
    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            res.status(401).json({message: "Unauthorized"})
            return
        }
        const token = await db.token.findUnique({
            where: {token: refreshToken},
            include: {user: true},
        })

        if (!token || !token.user) {
            res.status(403).json({message: "Forbidden"})
            return
        }

        const user = await db.user.findUnique({where: {id: token.user.id}})

        if (!user) {
            res.status(404).json({message: "User not found"})
            return
        }

        const accessToken = sign({userId: user.id, email: user.email, role: user.roles}, config.accessTokenSecret, {
            expiresIn: accessTokenExpiration
        })

        res.status(200).json({accessToken})
    }
}
