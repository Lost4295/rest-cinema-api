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
