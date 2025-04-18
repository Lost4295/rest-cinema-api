export interface CinemaRoomBody {
    id: number,
    name: string,
    description: string,
    images: string[],
    type: string,
    seats: number,
    disabledAccess: boolean,
    onMaintenance: boolean
}
