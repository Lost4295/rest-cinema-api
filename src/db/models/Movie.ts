import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {CinemaSession} from "./CinemaSession"

@Entity({name:'movies'})
export class Movie {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    duration: number
    @OneToMany((type) => CinemaSession, (session) => session.movie)
    sessions: CinemaSession[]

    constructor(
        id: number,
        name: string,
        duration: number,
        sessions: CinemaSession[]
    ) {
        this.id = id
        this.name = name
        this.duration = duration
        this.sessions = sessions
    }
}
