import {NextFunction, Request, Response} from "express"
import {verify} from "jsonwebtoken"
import {CurrentUser, userRoles} from "../types/currentUser"

export const classicAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const bearerSplit = authHeader.split(' ')
    if (bearerSplit.length < 2) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const token = bearerSplit[1]
    verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Forbidden" })
        return
      }

      const currentUser = user as CurrentUser

      const allowedRoles = [
        userRoles.CLASSIC,
        userRoles.CONFISERY,
        userRoles.ACCUEIL,
        userRoles.PROJECTIONIST,
        userRoles.ADMIN,
        userRoles.SUPER_ADMIN,
      ]

      if (!allowedRoles.includes(currentUser.role)) {
        res.status(403).json({ message: "Forbidden" })
        return
      }

      (req as any).user = currentUser

      next()
    })
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

  } catch (error) {
    if (error instanceof Error) {
    console.error(error.message)
    }
    res.status(500).send({ message: "Internal Server Error" })
  }
}

export const employeeAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const bearerSplit = authHeader.split(' ')
    if (bearerSplit.length < 2) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const token = bearerSplit[1]

    verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Forbidden" })
        return
      }

      if (!user) {
        res.status(401).json({ message: "Unauthorized" })
        return
      }

      const currentUser = user as CurrentUser
      
      const allowedRoles: string[] = [
        userRoles.CONFISERY,
        userRoles.ACCUEIL,
        userRoles.PROJECTIONIST,
        userRoles.ADMIN,
        userRoles.SUPER_ADMIN,
      ]

      if (!allowedRoles.includes(currentUser.role)) {
        res.status(403).json({ message: "Forbidden" })
        return
      }

      (req as any).user = currentUser

      next()
    })
  } catch (error) {
    if (error instanceof Error) {
    console.error(error.message)
    }
    res.status(500).send({ message: "Internal Server Error" })
  }
}

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const bearerSplit = authHeader.split(' ')
    if (bearerSplit.length < 2) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const token = bearerSplit[1]
    verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Forbidden" })
        return
      }

      if (!user) {
        res.status(401).json({ message: "Unauthorized" })
        return
      }

      const currentUser = user as CurrentUser

      const allowedRoles: string[] = [
        userRoles.ADMIN,
        userRoles.SUPER_ADMIN,
      ]

      if (!allowedRoles.includes(currentUser.role)) {
        res.status(403).json({ message: "Forbidden" })
        return
      }

      (req as any).user = currentUser

      next()
    })
  } catch (error) {
    if (error instanceof Error) {
    console.error(error.message)
    }
    res.status(500).send({ message: "Internal Server Error" })
  }
}

export const superAdminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const bearerSplit = authHeader.split(' ')
    if (bearerSplit.length < 2) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const token = bearerSplit[1]
    verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Forbidden" })
        return
      }

      if (!user) {
        res.status(401).json({ message: "Unauthorized" })
        return
      }

      const currentUser = user as CurrentUser
      if (currentUser.role !== userRoles.SUPER_ADMIN) {
        res.status(403).json({ message: "Forbidden" })
        return
      }

      (req as any).user = currentUser

      next()
    })
  } catch (error) {
    if (error instanceof Error) {
    console.error(error.message)
    }
    res.status(500).send({ message: "Internal Server Error" })
  }
}
