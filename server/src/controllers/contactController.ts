import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logActivity } from '../utils/activityLogger';

const prisma = new PrismaClient();

export const getContacts = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const contacts = await prisma.contact.findMany({
            where: { organizationId: req.user.organizationId },
            include: { account: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

export const createContact = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { name, email, phone, title, accountId } = req.body;

        let validAccountId = null;
        if (accountId) {
            const account = await prisma.account.findFirst({
                where: { id: Number(accountId), organizationId: req.user.organizationId }
            });
            if (account) validAccountId = account.id;
        }

        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                phone,
                title,
                accountId: validAccountId,
                organizationId: req.user.organizationId
            },
        });
        await logActivity('Added new contact', name, req.user.organizationId);
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create contact' });
    }
};

export const updateContact = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;
        const { name, email, phone, title, accountId } = req.body;

        const existing = await prisma.contact.findFirst({
            where: { id: Number(id), organizationId: req.user.organizationId }
        });
        if (!existing) return res.status(404).json({ message: 'Contact not found' });

        const contact = await prisma.contact.update({
            where: { id: Number(id) },
            data: {
                name,
                email,
                phone,
                title,
                accountId: accountId ? Number(accountId) : null
            }
        });
        await logActivity('Updated contact', name, req.user.organizationId);
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update contact' });
    }
}

export const deleteContact = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;

        const existing = await prisma.contact.findFirst({
            where: { id: Number(id), organizationId: req.user.organizationId }
        });
        if (!existing) return res.status(404).json({ message: 'Contact not found' });

        const contact = await prisma.contact.delete({ where: { id: Number(id) } });
        await logActivity('Deleted contact', contact.name, req.user.organizationId);
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
}
