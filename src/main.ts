import {config} from './config/config'
import app from "./app"
import {TspecDocsMiddleware} from "tspec"
import {tspecParams} from "./swagger/specs"

const start = async () => {

    const port = config.port

    // @ts-expect-error overload of tspec
    app.use('/docs', await TspecDocsMiddleware(tspecParams))

    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

start()
