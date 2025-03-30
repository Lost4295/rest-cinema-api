import { UserRoles } from "../db/models/User"

export interface CurrentUser {
  id: number
  email: string
  role: UserRoles
}
