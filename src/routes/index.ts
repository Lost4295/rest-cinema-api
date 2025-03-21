import { Application, Request, Response } from "express"
import {AdministratorController} from "../controllers/users/AdministratorController";
import {EmployeeController} from "../controllers/users/EmployeeController";
import {UserController} from "../controllers/users/UserController";
import {CinemaSessionController} from "../controllers/CinemaSessionController";
import {CinemaRoomController} from "../controllers/CinemaRoomController";
import {MovieController} from "../controllers/MovieController";
import {StatsController} from "../controllers/StatsController";
import {TicketController} from "../controllers/TicketController";

export const routesHandler = (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello World' })
  })
  app.get('/Administrator',AdministratorController.get)
  app.post('/Administrator',AdministratorController.post)
  app.put('/Administrator',AdministratorController.put)
  app.delete('/Administrator',AdministratorController.delete)
  app.get('/Ticket',TicketController.get)
  app.post('/Ticket',TicketController.post)
  app.put('/Ticket',TicketController.put)
  app.delete('/Ticket',TicketController.delete)
  app.get('/Employee',EmployeeController.get)
  app.post('/Employee',EmployeeController.post)
  app.put('/Employee',EmployeeController.put)
  app.delete('/Employee',EmployeeController.delete)
  app.get('/User',UserController.get)
  app.post('/User',UserController.post)
  app.put('/User',UserController.put)
  app.delete('User/,User.delete')
  app.get('/CinemaSession',CinemaSessionController.get)
  app.post('/CinemaSession',CinemaSessionController.post)
  app.put('/CinemaSession',CinemaSessionController.put)
  app.delete('/CinemaSession',CinemaSessionController.delete)
  app.get('/CinemaRoom',CinemaRoomController.get)
  app.post('/CinemaRoom',CinemaRoomController.post)
  app.put('/CinemaRoom',CinemaRoomController.put)
  app.delete('/CinemaRoom',CinemaRoomController.delete)
  app.get('/Movie',MovieController.get)
  app.post('/Movie',MovieController.post)
  app.put('/Movie',MovieController.put)
  app.delete('/Movie',MovieController.delete)
  app.get('/Stats',StatsController.get)
  app.post('/Stats',StatsController.post)
  app.put('/Stats',StatsController.put)
  app.delete('/Stats',StatsController.delete)
}
