import {config} from './config/config'
import {AppDataSource} from './db/database'
import app from "./app"
import {TspecDocsMiddleware} from "tspec"

export const start = async () => {

  const port = config.port

  // @ts-expect-error overload of tspec
  app.use('/docs', await TspecDocsMiddleware())
  try {
    await AppDataSource.initialize()
  } catch (error) {
    if (error instanceof Error) {
      //TODO : change with logger.error
      console.error(error.message)
    } else {
      //TODO : change with logger.error
      console.error('An error occurred')
    }
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

start()
