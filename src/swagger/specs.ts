import {CinemaSessionController} from "../controllers/CinemaSessionController"
import {CinemaRoomController} from "../controllers/CinemaRoomController"
import {MovieController} from "../controllers/MovieController"
import {Tspec} from "tspec"


const cinemaSessionController = new CinemaSessionController()
const cinemaRoomController = new CinemaRoomController()

const movieController = new MovieController()
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
