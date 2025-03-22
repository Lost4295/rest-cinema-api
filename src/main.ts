import express from 'express'
import { AppDataSource } from './db/database'
import { routesHandler } from './routes'

const app = async () => {
  const app = express()
  const port = 3000

  app.use(express.json())
  routesHandler(app)

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

app()
