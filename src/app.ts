import express from 'express'
import { routesHandler } from './routes'
import {TspecDocsMiddleware} from "tspec";

const app = express()

app.use(express.json())
routesHandler(app)


export default app;