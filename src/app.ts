import express from 'express'
import cookieParser from 'cookie-parser'
import winston from 'winston'
import DailyRotateFile from "winston-daily-rotate-file"
import {routesHandler} from "./routes"

const app = express()

app.use(express.json())
app.use(cookieParser())

const {combine, timestamp, json, printf} = winston.format
const timestampFormat = 'MMM-DD-YYYY HH:mm:ss'
export const logger = winston.createLogger({
    format: combine(
        timestamp({format: timestampFormat}),
        json(),
        printf(({timestamp, level, message, ...data}) => {
            const response = {
                level,
                timestamp,
                message,
                data, // metadata
            }

            return JSON.stringify(response)
        })),
    transports:
        [
            new winston.transports.Console(),
            new DailyRotateFile({
                // each file name includes current date
                filename: 'logs/logs-%DATE%.log',
                datePattern: 'MMMM-DD-YYYY',
                zippedArchive: false, // zip logs true/false
                maxSize: '20m', // rotate if file size exceeds 20 MB
                maxFiles: '14d' // max files
            })
        ]

})


routesHandler(app)

export default app
