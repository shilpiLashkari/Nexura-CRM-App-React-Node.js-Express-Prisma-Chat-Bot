import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logActivity } from './activityController';
import { executeWorkflows } from './workflowController';

const prisma = new PrismaClient();

// Simple deterministic AI Scoring
const calculateWinProbability = (value: number, stage: string): number => {
    let score = 0.5; // Base probability

    // Value factor
    if (value > 10000) score += 0.1;
    if (value > 50000) score += 0.1;

    // Stage factor
    if (stage === 'Negotiation') score += 0.2;
    if (stage === 'Won') return 1.0;
    if (stage === 'Lost') return 0.0;

    return Math.min(score, 0.99);
};

const getAiInsight = (score: number, value: number): string => {
    if (score > 0.8) return "High probability! Focus on closing.";
    if (value > 50000) return "High average value. Requires executive attention.";
    return "Standard deal progress.";
};

export const getDeals = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const deals = await prisma.deal.findMany({
            where: { organizationId: req.user.organizationId },
            include: { account: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(deals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch deals' });
    }
};

export const createDeal = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { title, value, stage, accountId } = req.body;

        const effectiveAccountId = accountId ? Number(accountId) : undefined;
        // Validate account ownership
        if (effectiveAccountId) {
            const account = await prisma.account.findFirst({
                where: { id: effectiveAccountId, organizationId: req.user.organizationId }
            });
            if (!account) return res.status(400).json({ message: 'Invalid Account' });
        } else {
            return res.status(400).json({ message: 'Account is required' });
        }

        const winProb = calculateWinProbability(Number(value), stage || 'New');
        const insight = getAiInsight(winProb, Number(value));

        const deal = await prisma.deal.create({
            data: {
                title,
                value: Number(value),
                stage: stage || 'New',
                winProbability: winProb,
                aiInsight: insight,
                accountId: effectiveAccountId,
                organizationId: req.user.organizationId
            },
        });
        await logActivity('Created deal', title, req.user.organizationId);

        // Trigger generic 'DEAL_CREATED' workflow if we had it, but mostly we care about stage changes

        res.json(deal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create deal' });
    }
};

export const updateDeal = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;
        const { title, value, stage, accountId } = req.body;

        const existingDeal = await prisma.deal.findUnique({ where: { id: Number(id) } });
        if (!existingDeal || existingDeal.organizationId !== req.user.organizationId) {
            return res.status(404).json({ message: 'Deal not found' });
        }

        const deal = await prisma.deal.update({
            where: { id: Number(id) },
            data: { title, value: Number(value), stage, accountId: Number(accountId) },
        });
        await logActivity('Updated deal', `${title} (${stage})`, req.user.organizationId);
        res.json(deal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update deal' });
    }
}

export const deleteDeal = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;

        const existing = await prisma.deal.findFirst({
            where: { id: Number(id), organizationId: req.user.organizationId }
        });
        if (!existing) return res.status(404).json({ message: 'Deal not found' });

        await prisma.deal.delete({
            where: { id: Number(id) },
        });
        await logActivity('Deleted deal', `ID: ${id}`, req.user.organizationId);
        res.json({ message: 'Deal deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete deal' });
    }
};
