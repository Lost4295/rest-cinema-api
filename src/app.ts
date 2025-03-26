import express from 'express'
import { routesHandler } from './routes'

const app = express()

app.use(express.json())
routesHandler(app)


export default app
