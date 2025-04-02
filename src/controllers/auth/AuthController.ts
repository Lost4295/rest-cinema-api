import { Request, Response } from "express"
import { AppDataSource } from "../../db/database"
import { User, userRoles } from "../../db/models/User"
import { authValidator } from "../../validators/auth"
import bcrypt from "bcrypt"
import { config } from "../../config/config"
import { sign } from "jsonwebtoken"
import { Token, userRelationName } from "../../db/models/Token"
import { CurrentUser } from "../../types/currentUser"

const accessTokenExpiration = config.env === "production" ? '30s' : '1d'
const refreshTokenExpiration = '7d'
const accessTokenSecret = config.accessTokenSecret
const refreshTokenSecret = config.refreshTokenSecret

export class AuthController {
  async login(req: Request, res: Response){
    const bodyValidator = authValidator.validate(req.body)
    if (bodyValidator.error!==undefined){
        console.error(bodyValidator.error)
        res.status(400).json(bodyValidator.error.details)
        return
    }
    const body = bodyValidator.value
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({where: {email: body.email}})
    if (!user){
        res.status(404).json({ message: "User not found" })
        return
    }
    const isPasswordCorrect = await bcrypt.compare(body.password, user.password)
    if (!isPasswordCorrect){
        res.status(401).json({ message: "Invalid password" })
        return
    }
    const currentUser: CurrentUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    }
    const accessToken = sign(currentUser, accessTokenSecret, {
      expiresIn: accessTokenExpiration
    })

    const refreshToken = sign(currentUser, refreshTokenSecret , {
      expiresIn: refreshTokenExpiration
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    const tokenRepository = AppDataSource.getRepository(Token)
    await tokenRepository.save({ token: refreshToken, user })

    res.status(200).json({ accessToken })

  }

  async register(req: Request, res: Response){
    const bodyValidator = authValidator.validate(req.body)
    if (bodyValidator.error!==undefined){
        console.error(bodyValidator.error)
        res.status(400).json(bodyValidator.error.details)
        return
    }
    const body = bodyValidator.value
    const movieRepository = AppDataSource.getRepository(User)
    const user = await movieRepository.findOne({where: {email: body.email}})
    if (user){
        res.status(400).json({ message: "User already exists" })
        return
    }
    const hashedPassword = await bcrypt.hash(body.password, 10)
    const newUser = {
      email: body.email,
      password: hashedPassword,
      role: userRoles.CLASSIC,
      tokens: [],
    }
    await movieRepository.save(newUser)

    res.status(201).json({ message: "User created" })
  }

  async logout(req: Request, res: Response){
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken){
        res.status(401).json({ message: "Unauthorized" })
        return
    }
    const tokenRepository = AppDataSource.getRepository(Token)
    const token = await tokenRepository.findOne({where: {token: refreshToken}})

    if (!token){
        res.status(403).json({ message: "Forbidden" })
        return
    }

    await tokenRepository.remove(token)
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict"
    })

    res.status(200).json({ message: "Logged out" })
  }

  async refreshToken(req: Request, res: Response){
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken){
        res.status(401).json({ message: "Unauthorized" })
        return
    }
    const tokenRepository = AppDataSource.getRepository(Token)
    const token = await tokenRepository.findOne({
      where: { token: refreshToken },
      relations: [userRelationName],
    })

    if (!token || !token.user){
        res.status(403).json({ message: "Forbidden" })
        return
    }

    const user = await AppDataSource.getRepository(User).findOne({where: {id: token.user.id}})

    if (!user){
        res.status(404).json({ message: "User not found" })
        return
    }

    const accessToken = sign({ userId: user.id, email: user.email, role: user.role }, config.accessTokenSecret, {
      expiresIn: accessTokenExpiration
    })

    res.status(200).json({ accessToken })
  }
}
