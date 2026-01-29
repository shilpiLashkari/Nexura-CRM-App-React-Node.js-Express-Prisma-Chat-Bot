// src/types/express.d.ts
import { User } from '@prisma/client' // or your User type

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number
                email: string
                organizationId: number
                role?: string
            }
        }
    }
}

export { }
