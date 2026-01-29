import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

export const register = async (req: Request, res: Response) => {
    const { organizationName, name, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction to create Org and User
        const result = await prisma.$transaction(async (prisma) => {
            const org = await prisma.organization.create({
                data: { name: organizationName }
            });

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'admin', // First user is admin
                    organizationId: org.id
                },
                include: { organization: true }
            });

            return user;
        });

        const token = jwt.sign({ userId: result.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { organization: true }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

export const getMe = async (req: Request, res: Response) => {
    // req.user is set by middleware
    res.json({ user: req.user });
};
