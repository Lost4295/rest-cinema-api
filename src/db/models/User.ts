import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity({name: "users"})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    password: string

    @Column()
    email: string

    @Column()
    role: string

    constructor(
        id: number,
        password: string,
        email: string,
        role: string
    ) {
        this.id = id
        this.password = password
        this.email = email
        this.role = role
    }
}
