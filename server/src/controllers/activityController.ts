import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getActivities = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const limit = req.query.limit ? Number(req.query.limit) : undefined;
        const activities = await prisma.activity.findMany({
            where: { organizationId: req.user.organizationId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
};
// Helper to log activities
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
        console.error('Failed to log activity', error);
    }
};
