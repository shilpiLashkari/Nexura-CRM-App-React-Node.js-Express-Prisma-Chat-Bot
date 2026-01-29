import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchGlobal = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;

        if (!query || query.length < 2) {
            return res.json({ accounts: [], deals: [], contacts: [] });
        }

        const orgId = req.user?.organizationId;
        if (!orgId) return res.status(401).json({ message: 'Unauthorized' });

        const [accounts, deals, contacts] = await Promise.all([
            prisma.account.findMany({
                where: {
                    organizationId: orgId,
                    name: { contains: query } // Case insensitive in SQLite usually, in PG use mode: 'insensitive'
                },
                take: 5
            }),
            prisma.deal.findMany({
                where: {
                    organizationId: orgId,
                    title: { contains: query }
                },
                take: 5
            }),
            prisma.contact.findMany({
                where: {
                    organizationId: orgId,
                    name: { contains: query }
                },
                take: 5
            })
        ]);

        res.json({ accounts, deals, contacts });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};
