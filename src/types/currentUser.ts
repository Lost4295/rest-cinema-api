
export interface CurrentUser {
  id: number
  email: string
  role: UserRoles
}

export const userRoles = {
  CLASSIC: "classic",
  EMPLOYEE: "employee",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin"
} as const

export type UserRoles = typeof userRoles[keyof typeof userRoles]
