import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name:"rooms"})
export class CinemaRoom{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column()
    description:string

    @Column()
    images: ImageData[]

    @Column()
    type:string

    @Column()
    capacity:number

    @Column()
    disabledAccess:boolean


    constructor(id: number, name: string, description: string, images: ImageData[], type: string, capacity: number, disabledAccess: boolean) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.images = images;
        this.type = type;
        this.capacity = capacity;
        this.disabledAccess = disabledAccess;
    }
}