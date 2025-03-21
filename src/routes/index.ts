import { Application, Request, Response } from "express"

export const routesHandler = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello World' })
  })
}
