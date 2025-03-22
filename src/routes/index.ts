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

 const administratorController = new AdministratorController();
 const employeeController = new EmployeeController();
 const userController = new UserController();
 const cinemaSessionController = new CinemaSessionController();
 const cinemaRoomController = new CinemaRoomController();
 const movieController = new MovieController();
 const statsController = new StatsController();
 const ticketController = new TicketController();

  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello World' })
  })
  //app.get('/Administrator',AdministratorController.get)
  //app.post('/Administrator',AdministratorController.post)
  //app.put('/Administrator',AdministratorController.put)
  //app.delete('/Administrator',AdministratorController.delete)
  //app.get('/Ticket',TicketController.get)
  //app.post('/Ticket',TicketController.post)
  //app.put('/Ticket',TicketController.put)
  //app.delete('/Ticket',TicketController.delete)
  //app.get('/Employee',EmployeeController.get)
  //app.post('/Employee',EmployeeController.post)
  //app.put('/Employee',EmployeeController.put)
  //app.delete('/Employee',EmployeeController.delete)
  //app.get('/User',UserController.get)
  //app.post('/User',UserController.post)
  //app.put('/User',UserController.put)
  //app.delete('User/',UserController.delete)
  app.get('/sessions',cinemaSessionController.get)
  app.post('/sessions',cinemaSessionController.post)
  app.put('/sessions',cinemaSessionController.put)
  app.delete('/sessions',cinemaSessionController.delete)
  app.get('/rooms',cinemaRoomController.get)
  app.post('/rooms',cinemaRoomController.post)
  app.put('/rooms',cinemaRoomController.put)
  app.delete('/rooms',cinemaRoomController.delete)
  app.get('/movies',movieController.get)
  app.post('/movies',movieController.post)
  app.put('/movies',movieController.put)
  app.delete('/movies',movieController.delete)
  //app.get('/Stats',StatsController.get)
  //app.post('/Stats',StatsController.post)
  //app.put('/Stats',StatsController.put)
  //app.delete('/Stats',StatsController.delete)
}
