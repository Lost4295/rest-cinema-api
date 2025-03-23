import { Application } from "express"
import { AdministratorController } from "../../controllers/users/AdministratorController"

export const administratorController = (app: Application) => {
  const administratorController = new AdministratorController()
  // TODO: Implement the routes
  // app.get('/', administratorController.get)
  // app.post('/', administratorController.post)
  // app.put('/', administratorController.put)
  // app.delete('/', administratorController.delete)
  // app.get('/:id', administratorController.getOne)
}
