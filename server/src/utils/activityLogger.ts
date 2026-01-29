import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const logActivity = async (action: string, target: string, organizationId: number) => {
    try {
        await prisma.activity.create({
            data: {
                action,
                target,
                organizationId
            }
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};
