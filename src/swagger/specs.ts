import {CinemaSessionController} from "../controllers/CinemaSessionController"
import {CinemaRoomController} from "../controllers/CinemaRoomController"
import {MovieController} from "../controllers/MovieController"
import {AuthController} from "../controllers/auth/AuthController"
import {Tspec} from "tspec"
import {UserController} from "../controllers/UserController"
import {TicketController} from "../controllers/TicketController"


const cinemaSessionController = new CinemaSessionController()
const cinemaRoomController = new CinemaRoomController()
const authController = new AuthController()
const movieController = new MovieController()
const userController = new UserController()
const ticketController = new TicketController()

export type sessionSpec = Tspec.DefineApiSpec<{
    tags: ['Sessions'],
    paths: {
        '/sessions': {
            get: {
                summary: 'Get all sessions.',
                handler: typeof cinemaSessionController.get,
                responses: { 200: { message: string } }
            },
            post: {
                summary: 'TODO: Write this',
                handler: typeof cinemaSessionController.post,
                responses: { 200: { message: string } }
            },
        },
        '/sessions/{id}': {
            get: {
                summary: 'TODO: finish this',
                responses: { 200: { message: string } }
            },
            put: {
                summary: 'TODO: Write this',
                handler: typeof cinemaSessionController.put,
                responses: { 200: { message: string } }
            }
            delete: {
                summary: 'TODO: Write this',
                handler: typeof cinemaSessionController.delete,
                responses: { 200: { message: string } }
            }
        }
        '/sessions/{id}/tickets': {
            get: {
                summary: 'TODO: Write this',
                handler: typeof cinemaSessionController.getOneTickets,
                responses: { 200: { message: string } }
            }
        }
    }
}>

export type roomSpec = Tspec.DefineApiSpec<{
    tags: ['Rooms'],
    paths: {
        '/rooms': {
            get: {
                summary: 'Get all rooms.',
                handler: typeof cinemaRoomController.get,
                responses: { 200: { message: string } }
            },
            post: {
                summary: 'TODO: Write this',
                handler: typeof cinemaRoomController.post,
                responses: { 200: { message: string } }
            },
        },
        '/rooms/{id}': {
            get: {
                summary: 'TODO: Write this',
                handler: typeof cinemaRoomController.getOne,
                responses: { 200: { message: string } }
            },
            put: {
                summary: 'TODO: Write this',
                handler: typeof cinemaRoomController.put,
                responses: { 200: { message: string } }
            },
            delete: {
                summary: 'TODO: Write this',
                handler: typeof cinemaRoomController.delete,
                responses: { 200: { message: string } }
            }
        }
    }
}>

export type movieSpec = Tspec.DefineApiSpec<{
    tags: ['Movies'],
    paths: {
        '/movies': {
            get: {
                summary: 'Get all movies.',
                handler: typeof movieController.get,
                responses: { 200: { message: string } }
            },
            post: {
                summary: 'TODO: Write this',
                handler: typeof movieController.post,
                responses: { 200: { message: string } }
            },
        },
        '/movies/{id}': {
            get: {
                summary: 'TODO: Write this',
                handler: typeof movieController.getOne,
                responses: { 200: { message: string } }
            },
            put: {
                summary: 'TODO: Write this',
                handler: typeof movieController.put,
                responses: { 200: { message: string } }
            }
            delete: {
                summary: 'TODO: Write this',
                handler: typeof movieController.delete,
                responses: { 200: { message: string } }
            }
        }
    }
}>

export type baseSpec = Tspec.DefineApiSpec<{
    tags: ['Authentication'],
    paths: {
        '/auth/login': {
            post: {
                summary: 'TODO: Write this'
                handler: typeof authController.login,
                responses: {}
            }
        },
        '/auth/register': {
            post: {
                summary: 'TODO: Write this'
                handler: typeof authController.register,
                responses: {}
            }
        },
        '/auth/logout': {
            get: {
                summary: 'TODO: Write this'
                handler: typeof authController.logout,
                responses: {}
            }
        },
        '/auth/refresh-token': {
            get: {
                summary: 'TODO: Write this'
                handler: typeof authController.refreshToken,
                responses: {}
            }
        },
    }
}>

export type userSpec = Tspec.DefineApiSpec<{
    tags: ['Users'],
    paths: {
        '/users': {
            get: {
                summary: 'TODO: Write this',
                handler: typeof userController.getAll,
                responses: {}
            },
            post: {
                summary: 'TODO: Write this',
                handler: typeof userController.createUserWithRole,
                responses: {}
            }
        },
        '/users/profile': {
            get: {
                summary: 'TODO: Write this',
                handler: typeof userController.getProfile,
                responses: {}
            }
        },
        '/users/password': {
            put: {
                summary: 'TODO: Write this',
                handler: typeof userController.updatePassword,
                responses: {}
            }
        },
        '/users/{id}': {
            delete: {
                summary: 'TODO: Write this',
                handler: typeof userController.deleteUser,
                responses: {}
            }
        },
    }
}>

export type ticketSpec = Tspec.DefineApiSpec<{
    tags: ["Tickets"],
    paths: {
        '/tickets': {
            get: {
                summary: 'Get all tickets.',
                handler: typeof ticketController.get,
                responses: { 200: { message: string } }
            },
            post: {
                summary: 'TODO: Write this',
                handler: typeof ticketController.buyTicket,
                responses: { 200: { message: string } }
            },
        },
        '/tickets/{id}': {
            get: {
                summary: 'TODO: Write this',
                handler: typeof ticketController.useTicket,
                responses: { 200: { message: string } }
            },
            put: {
                summary: 'TODO: Write this',
                handler: typeof ticketController.modifyTicket,
                responses: { 200: { message: string } }
            },
            delete: {
                summary: 'TODO: Write this',
                handler: typeof ticketController.delete,
                responses: { 200: { message: string } }
            }
        }
    }
}>
