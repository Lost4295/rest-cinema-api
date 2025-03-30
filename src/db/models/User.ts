import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import { Token } from "./Token"

@Entity({name: "users"})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    password: string

    @Column()
    email: string

    @Column()
    role: UserRoles

    @OneToMany(() => Token, token => token.user)
    tokens: Token[]

    constructor(
        id: number,
        password: string,
        email: string,
        role: UserRoles,
        tokens: Token[]
    ) {
        this.id = id
        this.password = password
        this.email = email
        this.role = role
        this.tokens = tokens
    }
}

export const userRoles = {
    CLASSIC: "classic",
    EMPLOYEE: "employee",
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin"
} as const

export type UserRoles = typeof userRoles[keyof typeof userRoles]
