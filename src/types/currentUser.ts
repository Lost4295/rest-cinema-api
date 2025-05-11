
export interface CurrentUser {
  id: number
  email: string
  role: UserRoles
}

export const userRoles = {
  CLASSIC: "classic",
  CONFISERY: "confiseur",
  ACCUEIL: "accueil",
  PROJECTIONIST: "projectionist",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin"
} as const

export type UserRoles = typeof userRoles[keyof typeof userRoles]
