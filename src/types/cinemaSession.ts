export interface CinemaSessionBody {
    id: number,
    startDate: Date,
    endDate: Date,
    tickets?: number
    movie: number,
    room: undefined
}

export interface CinemaSessionBodyWithRelations {
    id: number,
    startDate: Date,
    endDate: Date,
    movie: number,
    room: number,
}


export interface TypeSession {
    startDate: Date,
    endDate: Date,
    movie: number,
    room: number,
}

export type SessionObject = {
    room: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        images: string[];
        type: string;
        seats: number;
        disabledAccess: boolean;
        onMaintenance: boolean
    }
} & {
    startDate: Date;
    endDate: Date;
    id: number;
    movie: number;
    room: number;
    createdAt: Date;
    updatedAt: Date
}

