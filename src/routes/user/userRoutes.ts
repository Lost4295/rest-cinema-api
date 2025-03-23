import { Application } from "express"
import { UserController } from "../../controllers/users/UserController"

export const userController = (app: Application) => {
  const userController = new UserController()
  // TODO: Implement the routes
  // app.get('/', userController.get)
  // app.post('/', userController.post)
  // app.put('/', userController.put)
  // app.delete('/', userController.delete)
  // app.get('/:id', userController.getOne)
}
