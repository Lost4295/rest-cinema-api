import { AppDataSource } from './db/database'
import app from "./app";
import {TspecDocsMiddleware} from "tspec";

export const start = async () => {
  const port = 3000
  // @ts-ignore
  app.use('/docs', await TspecDocsMiddleware());

  try {
    await AppDataSource.initialize()
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error('An error occurred')
    }
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

start()
