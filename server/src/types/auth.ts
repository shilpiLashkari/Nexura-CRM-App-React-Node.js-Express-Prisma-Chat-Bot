import { Request } from 'express'

export interface AuthUser {
    id: number
    email: string
    organizationId: number
    role?: string
}

export interface AuthRequest extends Request {
    user: AuthUser
}
