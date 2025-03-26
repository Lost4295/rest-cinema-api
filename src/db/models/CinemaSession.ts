import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Movie} from './Movie'
import {CinemaRoom} from "./CinemaRoom";

@Entity({name: "sessions"})
export class CinemaSession {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "timestamptz"})
    startDate: Date

    @Column({type: "timestamptz"})
    endDate: Date

    @ManyToOne(() => Movie, movie => movie.sessions)
    @JoinColumn({name:"movie_id"})
    movie: Movie

    @ManyToOne(() => CinemaRoom, room => room.sessions)
    @JoinColumn({name:"room_id"})
    room:CinemaRoom

    @Column()
    tickets:number

    constructor(
        id: number,
        startDate: Date,
        endDate: Date,
        movie: Movie,
        room:CinemaRoom,
        tickets:number
    ) {
        this.id = id
        this.startDate = startDate
        this.endDate = endDate
        this.movie = movie
        this.room = room
        this.tickets = tickets
    }
}

export interface CinemaSessionBody{
    id: number,
    startDate: Date,
    endDate: Date,
    movie: Movie
}
