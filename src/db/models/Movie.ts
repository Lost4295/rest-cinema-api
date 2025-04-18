import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import type {CinemaSession} from "./CinemaSession"

@Entity({name: "movies"})
export class Movie {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    duration: number

    @OneToMany("sessions","movie")
    sessions: CinemaSession[] | undefined

    constructor(
        id: number,
        name: string,
        duration: number,
    ) {
        this.id = id
        this.name = name
        this.duration = duration
    }
}

export interface MovieBody {
    id: number,
    name: string,
    duration: number,
}
