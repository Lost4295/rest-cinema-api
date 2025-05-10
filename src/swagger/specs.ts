import {CinemaSessionController} from "../controllers/CinemaSessionController"
import {CinemaRoomController} from "../controllers/CinemaRoomController"
import {MovieController} from "../controllers/MovieController"
import {AuthController} from "../controllers/auth/AuthController"
import {Tspec} from "tspec"
import {UserController} from "../controllers/UserController"
import {TicketController} from "../controllers/TicketController"
import {UtilsController} from "../controllers/UtilsController"

const cinemaSessionController = new CinemaSessionController()
const cinemaRoomController = new CinemaRoomController()
const authController = new AuthController()
const movieController = new MovieController()
const userController = new UserController()
const ticketController = new TicketController()
const utilsController = new UtilsController()

export type otherSpec = Tspec.DefineApiSpec<{
    tags: ['Other'],
    paths: {
        '/': {
            get: {
                summary: "Outputs the state of the cinema. Can be open or closed."
                handler: typeof utilsController.baseRoute,
                responses: { 200: { message: string } }
            }
        }
    }
}>

export type sessionSpec = Tspec.DefineApiSpec<{
    tags: ['Sessions'],
    paths: {
        '/sessions': {
            get: {
                summary: 'Get all sessions.',
                handler: typeof cinemaSessionController.get,
                responses: { 200: { message: string }, 400: { message: string } }
            },
            post: {
                summary: 'Create a session.',
                handler: typeof cinemaSessionController.post,
                responses: {
                    201: { message: string },
                    400: { message: string },
                    404: { message: string },
                    401: { message: string }
                }
            },
        },
        '/sessions/{id}': {
            get: {
                summary: 'Get information about a session.',
                responses: { 200: { message: string }, 400: { message: string }, 404: { message: string } }
            },
            put: {
                summary: 'Update a session.',
                handler: typeof cinemaSessionController.put,
                responses: { 200: { message: string }, 400: { message: string }, 404: { message: string } }
            }
            delete: {
                summary: 'Delete a session.',
                handler: typeof cinemaSessionController.delete,
                responses: { 204: {}, 400: { message: string }, 404: { message: string } }
            }
        }
        '/sessions/{id}/tickets': {
            get: {
                summary: 'Get information about the remaining tickets for a session.',
                handler: typeof cinemaSessionController.getOneTickets,
                responses: { 200: { message: string }, 400: { message: string }, 404: { message: string } }
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
                summary: 'Create a room.',
                handler: typeof cinemaRoomController.post,
                responses: { 201: { message: string }, 400: { message: string } }
            },
        },
        '/rooms/{id}': {
            get: {
                summary: 'Get information about one room.',
                handler: typeof cinemaRoomController.getOne,
                responses: { 200: { message: string }, 400: { message: string }, 404: { message: string } }
            },
            put: {
                summary: 'Update a room.',
                handler: typeof cinemaRoomController.put,
                responses: { 200: { message: string }, 400: { message: string }, 404: { message: string } }
            },
            delete: {
                summary: 'Delete a room.',
                handler: typeof cinemaRoomController.delete,
                responses: { 204: {}, 400: { message: string }, 404: { message: string } }
            }
        },
        "/:id/maintenance/on": {
            get: {
                summary: "Sets the selected room on maintenance. It will not be accessible.",
                handler: typeof cinemaRoomController.setMaintenance,
                responses: { 200: { message: string }, 400: { message: string }, 404: { message: string } }
            }
        },
        "/:id/maintenance/off": {
            get: {
                summary: "Sets the selected room off maintenance. It will be available.",
                handler: typeof cinemaRoomController.removeMaintenance,
                responses: { 200: { message: string }, 400: { message: string }, 404: { message: string } }
            }
        },

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
                summary: 'Create a movie.',
                handler: typeof movieController.post,
                responses: { 201: { message: string }, 400: { message: string } }
            },
        },
        '/movies/{id}': {
            get: {
                summary: 'Get information about one movie.',
                handler: typeof movieController.getOne,
                responses: { 200: { message: string }, 400: { message: string }, 404: { message: string } }
            },
            put: {
                summary: 'Modify a movie.',
                handler: typeof movieController.put,
                responses: { 200: { message: string }, 400: { message: string }, 404: { message: string } }
            }
            delete: {
                summary: 'Delete a movie.',
                handler: typeof movieController.delete,
                responses: { 204: { message: string }, 400: { message: string }, 404: { message: string } }
            }
        }
    }
}>

export type baseSpec = Tspec.DefineApiSpec<{
    tags: ['Authentication'],
    paths: {
        '/auth/login': {
            post: {
                summary: 'Logs the user.'
                handler: typeof authController.login,
                responses: {
                    400: { message: string },
                    404: { message: string },
                    401: { message: string },
                    200: { message: string },
                }
            }
        },
        '/auth/register': {
            post: {
                summary: 'Creates the user.'
                handler: typeof authController.register,
                responses: {
                    400: { message: string },
                    201: { message: string },
                }
            }
        },
        '/auth/logout': {
            get: {
                summary: 'Disconnects the user.'
                handler: typeof authController.logout,
                responses: {
                    401: { message: string },
                    403: { message: string },
                    200: { message: string },
                }
            }
        },
        '/auth/refresh-token': {
            get: {
                summary: 'Creates a new token for a user.'
                handler: typeof authController.refreshToken,
                responses: {
                    403: { message: string },
                    404: { message: string },
                    401: { message: string },
                    200: { message: string },
                }
            }
        },
    }
}>

export type userSpec = Tspec.DefineApiSpec<{
    tags: ['Users'],
    paths: {
        '/users': {
            get: {
                summary: 'Get all users.',
                handler: typeof userController.getAll,
                responses: { 200: { message: string }, 500: { message: string }, 404: { message: string } }
            },
            post: {
                summary: 'Create a user with a specific role.',
                handler: typeof userController.createUserWithRole,
                responses: { 201: { message: string }, 400: { message: string }, 500: { message: string } }
            }
        },
        '/users/profile': {
            get: {
                summary: 'Get information about the connected user.',
                handler: typeof userController.getProfile,
                responses: {
                    200: { message: string },
                    400: { message: string },
                    401: { message: string }
                    404: { message: string }
                    500: { message: string }
                }
            }
        },
        '/users/password': {
            put: {
                summary: 'Update the connected user\'s password.',
                handler: typeof userController.updatePassword,
                responses: {
                    200: { message: string },
                    400: { message: string },
                    401: { message: string }
                    404: { message: string }
                    500: { message: string }
                }
            }
        },
        '/users/{id}': {
            delete: {
                summary: 'Delete a user.',
                handler: typeof userController.deleteUser,
                responses: {
                    200: { message: string },
                    400: { message: string },
                    404: { message: string }
                    500: { message: string }
                }
            }
        },
        "/users/credit": {
            get: {
                summary: 'Add credit to the user.',
                handler: typeof userController.creditMoney,
                responses: {
                    200: { message: string },
                    400: { message: string },
                    401: { message: string },
                    404: { message: string }
                    500: { message: string }
                }
            }
        },
        "/users/debite": {
            get: {
                summary: 'Debit the user.',
                handler: typeof userController.debiteMoney,
                responses: {
                    200: { message: string },
                    400: { message: string },
                    401: { message: string },
                    404: { message: string }
                    500: { message: string }
                }
            }
        },
        "/users/mytransaction": {
            get: {
                summary: 'View my transactions.',
                handler: typeof userController.getMyTransaction,
                responses: {
                    200: { message: string },
                    400: { message: string },
                    401: { message: string },
                    404: { message: string }
                    500: { message: string }
                }
            }
        },
        "/users/transactions": {
            get: {
                summary: 'Get all transactions.',
                handler: typeof userController.getAllTransaction,
                responses: {
                    200: { message: string },
                    400: { message: string },
                    401: { message: string },
                    404: { message: string }
                    500: { message: string }
                }
            }
        },
        "/users/all-user-used-api": {
            get: {
                summary: 'Get all users from the API.',
                handler: typeof userController.getAllUserUsedAPi,
                responses: {
                    200: { message: string },
                    400: { message: string },
                    404: { message: string }
                    500: { message: string }
                }
            }
        },
        "/users/:id/user-activity": {
            get: {
                summary: 'Get a user\'s activity.',
                handler: typeof userController.getUserDetailsAndActivity,
                responses: {
                    200: { message: string },
                    400: { message: string },
                    404: { message: string }
                    500: { message: string }
                }
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
                responses: {
                    200: { message: string },
                    400: { message: string },
                }
            },
            post: {
                summary: 'Create a ticket associated to the user.',
                handler: typeof ticketController.buyTicket,
                responses: {
                    200: { message: string },
                    400: { message: string },
                }
            },
        },
        '/tickets/{id}': {
            get: {
                summary: 'Associate a ticket to a session.',
                handler: typeof ticketController.useTicket,
                responses: {
                    200: { message: string },
                    400: { message: string },
                }
            },
            put: {
                summary: 'Modify a ticket',
                handler: typeof ticketController.modifyTicket,
                responses: {
                    200: { message: string },
                    400: { message: string },
                    404: { message: string }
                }
            },
            delete: {
                summary: 'Delete a ticket.',
                handler: typeof ticketController.delete,
                responses: {
                    204: { message: string },
                    400: { message: string },
                    404: { message: string }
                }
            }
        }
    }
}>
