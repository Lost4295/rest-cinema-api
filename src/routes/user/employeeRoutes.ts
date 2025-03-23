import { Application } from "express"
import { EmployeeController } from "../../controllers/users/EmployeeController"

export const employeeController = (app: Application) => {
  const employeeController = new EmployeeController()
  // TODO: Implement the routes
  // app.get('/', employeeController.get)
  // app.post('/', employeeController.post)
  // app.put('/', employeeController.put)
  // app.delete('/', employeeController.delete)
  // app.get('/:id', employeeController.getOne)
}
