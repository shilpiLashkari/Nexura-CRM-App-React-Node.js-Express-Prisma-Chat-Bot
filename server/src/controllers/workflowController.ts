import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logActivity } from './activityController';

const prisma = new PrismaClient();

// Get all workflows for the organization
export const getWorkflows = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const workflows = await prisma.workflow.findMany({
            where: { organizationId: req.user.organizationId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(workflows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch workflows' });
    }
};

// Create a new workflow
export const createWorkflow = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { name, trigger, action, actionParams } = req.body;

        const workflow = await prisma.workflow.create({
            data: {
                name,
                trigger,
                action,
                actionParams: JSON.stringify(actionParams || {}),
                organizationId: req.user.organizationId
            }
        });

        await logActivity('Created workflow', name, req.user.organizationId);
        res.json(workflow);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create workflow' });
    }
};

// Delete a workflow
export const deleteWorkflow = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;

        await prisma.workflow.deleteMany({
            where: {
                id: Number(id),
                organizationId: req.user.organizationId // Ensure ownership
            }
        });

        res.json({ message: 'Workflow deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete workflow' });
    }
};

// --- Trigger Logic (Internal) ---

export const executeWorkflows = async (trigger: string, context: any, organizationId: number) => {
    try {
        const workflows = await prisma.workflow.findMany({
            where: {
                organizationId,
                trigger,
                isActive: true
            }
        });

        for (const wf of workflows) {
            console.log(`Executing workflow: ${wf.name}`);
            if (wf.action === 'CREATE_ACTIVITY') {
                const params = JSON.parse(wf.actionParams);
                // Create an automated activity
                await prisma.activity.create({
                    data: {
                        action: 'System Automation',
                        target: params.message || `Automated task for ${context.title}`,
                        organizationId
                    }
                });
            }
        }
    } catch (error) {
        console.error('Workflow execution failed:', error);
    }
};
