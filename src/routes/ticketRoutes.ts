import {Router} from "express"
import {TicketController} from "../controllers/TicketController"
import {classicAuthMiddleware} from "../middleware/auth"

export const ticketRoutes = Router()

const ticketController = new TicketController()

ticketRoutes.get("/", classicAuthMiddleware, ticketController.get)
ticketRoutes.post("/", ticketController.buyTicket)
ticketRoutes.put("/:id", ticketController.modifyTicket)
ticketRoutes.delete("/:id", ticketController.delete)
ticketRoutes.get("/:id", ticketController.useTicket)

export const testTicketRoutes = Router()

testTicketRoutes.get("/", ticketController.get)
testTicketRoutes.post("/", ticketController.buyTicket)
testTicketRoutes.put("/:id", ticketController.modifyTicket)
testTicketRoutes.delete("/:id", ticketController.delete)
testTicketRoutes.get("/:id", ticketController.useTicket)
