import {Column, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {CinemaSession} from "./CinemaSession";
import {name} from "ts-jest/dist/transformers/hoist-jest";

export class Movie {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    duration: number
    @OneToMany("sessions", "movie")
    sessions: CinemaSession[]

    constructor(
        id: number,
        name: string,
        duration: number,
        sessions: CinemaSession[]
    ) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.sessions = sessions;
    }
}
