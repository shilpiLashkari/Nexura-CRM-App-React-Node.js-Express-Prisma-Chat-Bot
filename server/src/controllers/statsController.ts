import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const orgId = req.user.organizationId;

        // Fetch basic stats
        const totalAccounts = await prisma.account.count({
            where: { organizationId: orgId }
        });

        // Get all deals for the organization
        const allDeals = await prisma.deal.findMany({
            where: { organizationId: orgId }
        });

        // Calculate stats from deals
        const activeDealsCount = allDeals.filter(d => d.stage !== 'Lost').length;
        const wonDeals = allDeals.filter(d => d.stage === 'Won');
        const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);

        // Simple mock trends for now
        const trends = {
            accounts: '+12.5%',
            deals: '+5.2%',
            revenue: '-2.4%'
        };

        // Calculate deals by stage manually
        const stageCount: Record<string, number> = {};
        allDeals.forEach(deal => {
            stageCount[deal.stage] = (stageCount[deal.stage] || 0) + 1;
        });
        const dealsByStage = Object.entries(stageCount).map(([name, value]) => ({ name, value }));

        // Revenue Forecast
        const forecastValue = allDeals
            .filter(d => d.stage !== 'Lost')
            .reduce((sum, deal) => {
                const prob = deal.stage === 'Won' ? 1 : deal.stage === 'Negotiation' ? 0.5 : 0.1;
                return sum + (deal.value * prob);
            }, 0);

        res.json({
            accounts: { value: totalAccounts, trend: trends.accounts, positive: true },
            deals: { value: activeDealsCount, trend: trends.deals, positive: true },
            revenue: { value: totalRevenue, trend: trends.revenue, positive: false },
            charts: {
                dealsByStage,
                revenueForecast: [
                    { name: 'Aug', value: totalRevenue * 0.7 },
                    { name: 'Sep', value: totalRevenue * 0.85 },
                    { name: 'Oct', value: totalRevenue * 0.6 },
                    { name: 'Nov', value: totalRevenue * 0.9 },
                    { name: 'Dec', value: totalRevenue },
                    { name: 'Jan', value: Math.round(forecastValue) }
                ]
            }
        });

    } catch (error: any) {
        console.error('Stats error:', error?.message || error);
        console.error('Stack:', error?.stack);
        res.status(500).json({ error: 'Failed to fetch stats', details: error?.message });
    }
};
