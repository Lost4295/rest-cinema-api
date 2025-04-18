import {Movie, Room} from "../db/client"

export interface CinemaSessionBody {
    id: number,
    startDate: Date,
    endDate: Date,
    tickets?: number
    movie: Movie,
    room: Room
}

export interface CinemaSessionBodyWithRelations {
    id: number,
    startDate: Date,
    endDate: Date,
    tickets?: number,
    movie: undefined,
    room: undefined,
}
