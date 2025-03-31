import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {TestMovie as Movie} from './Movie'
import {TestCinemaRoom} from "./CinemaRoom"

@Entity({name: "sessions"})
export class TestCinemaSession extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "date"})
    startDate: Date

    @Column({type: "date"})
    endDate: Date

    @Column({type: "time"})
    startTime: string
    @Column({type: "time"})
    endTime: string

    @ManyToOne(() => Movie, movie => movie.sessions)
    @JoinColumn({name: "movie_id"})
    movie: Movie

    @ManyToOne(() => TestCinemaRoom, room => room.sessions)
    @JoinColumn({name: "room_id"})
    room: TestCinemaRoom

    @Column()
    tickets: number

    constructor(
        id: number,
        startDate: Date,
        endDate: Date,
        movie: Movie,
        room: TestCinemaRoom,
        tickets: number,
        startTime: string,
        endTime: string
    ) {
        super();
        this.id = id
        this.startDate = startDate
        this.endDate = endDate
        this.movie = movie
        this.room = room
        this.tickets = tickets
        this.startTime =startTime
        this.endTime =endTime
    }
}

