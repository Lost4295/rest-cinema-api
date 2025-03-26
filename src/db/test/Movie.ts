import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {TestCinemaSession as CinemaSession } from "./CinemaSession"

@Entity({name: "movies"})
export class TestMovie extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    duration: number

    @OneToMany(() => CinemaSession, session => session.movie)
    sessions: CinemaSession[] | undefined

    constructor(
        id: number,
        name: string,
        duration: number,
    ) {
        super();
        this.id = id
        this.name = name
        this.duration = duration
    }
}
