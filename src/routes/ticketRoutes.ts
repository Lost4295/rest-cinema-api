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
