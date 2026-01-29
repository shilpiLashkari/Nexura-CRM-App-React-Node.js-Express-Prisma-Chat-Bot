import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logActivity } from '../utils/activityLogger';

const prisma = new PrismaClient();

export const getAccounts = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const accounts = await prisma.account.findMany({
            where: { organizationId: req.user.organizationId },
            include: { contacts: true, deals: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
};

export const createAccount = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { name, industry, website, address } = req.body;
        const account = await prisma.account.create({
            data: {
                name,
                industry,
                website,
                address,
                organizationId: req.user.organizationId
            },
        });
        await logActivity('Created account', name, req.user.organizationId);
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create account' });
    }
};

export const updateAccount = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;
        const { name, industry, website, address } = req.body;

        const existing = await prisma.account.findFirst({
            where: { id: Number(id), organizationId: req.user.organizationId }
        });
        if (!existing) return res.status(404).json({ message: 'Account not found' });

        const account = await prisma.account.update({
            where: { id: Number(id) },
            data: { name, industry, website, address }
        });
        await logActivity('Updated account', name, req.user.organizationId);
        res.json(account);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update account' });
    }
}

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;

        const existing = await prisma.account.findFirst({
            where: { id: Number(id), organizationId: req.user.organizationId }
        });
        if (!existing) return res.status(404).json({ message: 'Account not found' });

        const account = await prisma.account.delete({ where: { id: Number(id) } });
        await logActivity('Deleted account', account.name, req.user.organizationId);
        res.json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
}

export const importAccounts = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { accounts } = req.body; // Expecting array of { name, industry, website? }

        if (!Array.isArray(accounts)) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        const createdAccounts = await prisma.$transaction(
            accounts.map((acc: any) => prisma.account.create({
                data: {
                    name: acc.name,
                    industry: acc.industry,
                    website: acc.website,
                    address: acc.address,
                    organizationId: req.user!.organizationId
                }
            }))
        );

        await logActivity('Imported accounts', `${createdAccounts.length} accounts`, req.user.organizationId);
        res.json({ message: `Successfully imported ${createdAccounts.length} accounts`, count: createdAccounts.length });
    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ error: 'Failed to import accounts' });
    }
};
