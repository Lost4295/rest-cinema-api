import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Movie} from './Movie'
import {JoinColumn} from "typeorm";

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

    constructor(
        id: number,
        startDate: Date,
        endDate: Date,
        movie: Movie
    ) {
        this.id = id
        this.startDate = startDate
        this.endDate = endDate
        this.movie = movie
    }
}

export interface CinemaSessionBody{
    id: number,
    startDate: Date,
    endDate: Date,
    movie: number
}
