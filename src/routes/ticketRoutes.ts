import {Router} from "express"
import {TicketController} from "../controllers/TicketController"
import {adminAuthMiddleware} from "../middleware/auth"

export const ticketRoutes = Router()

const ticketController = new TicketController()

ticketRoutes.get("/", adminAuthMiddleware, ticketController.getAll)
ticketRoutes.get("/me", ticketController.get)
ticketRoutes.post("/", ticketController.buyTicket)
ticketRoutes.put("/:id", adminAuthMiddleware, ticketController.modifyTicket)
ticketRoutes.delete("/:id", ticketController.delete)
ticketRoutes.get("/:id", ticketController.useTicket)

export const testTicketRoutes = Router()

testTicketRoutes.get("/", ticketController.getAll)
testTicketRoutes.get("/me", ticketController.get)
testTicketRoutes.post("/", ticketController.buyTicket)
testTicketRoutes.put("/:id", ticketController.modifyTicket)
testTicketRoutes.delete("/:id", ticketController.delete)
testTicketRoutes.get("/:id", ticketController.useTicket)
