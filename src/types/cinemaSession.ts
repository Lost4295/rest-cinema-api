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
    movie: undefined,
    room: undefined,
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
    movieId: number;
    roomId: number;
    createdAt: Date;
    updatedAt: Date
}

