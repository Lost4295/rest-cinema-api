import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity({name: "rooms"})
export class CinemaRoom {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column({type:"text", array:true})
    images: string[]

    @Column()
    type: string

    @Column()
    capacity: number

    @Column()
    disabledAccess: boolean

    @Column()
    onMaintenance:boolean


    constructor(
        id: number,
        name: string,
        description: string,
        images: string[],
        type: string,
        capacity: number,
        disabledAccess: boolean,
        onMaintenance: boolean
    ) {
        this.id = id
        this.name = name
        this.description = description
        this.images = images
        this.type = type
        this.capacity = capacity
        this.disabledAccess = disabledAccess
        this.onMaintenance = onMaintenance
    }
}

export interface CinemaRoomBody{
    id: number,
    name: string,
    description: string,
    images: string[],
    type: string,
    capacity: number,
    disabledAccess: boolean,
    onMaintenance: boolean
}
