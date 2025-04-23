import {config} from './config/config'
import app from "./app"
import {TspecDocsMiddleware} from "tspec"

export const start = async () => {

    const port = config.port

    // @ts-expect-error overload of tspec
    app.use('/docs', await TspecDocsMiddleware())

    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

start()
