import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

/**
 * Handles AI chat requests.
 * Uses Gemini AI to generate responses based on CRM context.
 */
export const chatWithAI = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const orgId = req.user?.organizationId;

        if (!orgId) return res.status(401).json({ message: 'Unauthorized' });
        if (!message) return res.status(400).json({ message: 'Message is required' });


        const [wonDeals, dealCount, activeCount, accountCount, contactCount] = await Promise.all([
            prisma.deal.findMany({ where: { organizationId: orgId, stage: 'Won' } }),
            prisma.deal.count({ where: { organizationId: orgId } }),
            prisma.deal.count({ where: { organizationId: orgId, stage: { not: 'Lost' } } }),
            prisma.account.count({ where: { organizationId: orgId } }),
            prisma.contact.count({ where: { organizationId: orgId } })
        ]);
        const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);


        if (process.env.GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                const prompt = `
                    You are NexusAI, an intelligent CRM assistant for this business.
                    
                    Current Business Context:
                    - Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}
                    - Total Deals: ${dealCount}
                    - Active Pipeline: ${activeCount} deals
                    - Total Clients (Accounts): ${accountCount}
                    - Total Contacts: ${contactCount}
                    - Open Job Vacancies: Senior Frontend Developer, Sales Executive, Product Designer, Backend Engineer.
                    
                    User Question: "${message}"
                    
                    Instructions:
                    - Answer the user's question concisely based *strictly* on the context provided above if relevant.
                    - If the user asks about navigation (settings, reports), guide them.
                    - Be professional but friendly.
                    - If the data isn't in the context, say you don't have that info yet.
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                return res.json({ response: response.text() });

            } catch (llmError) {
                console.error("Gemini API Error (falling back to rules):", llmError);
                // Fall through to keyword logic
            }
        }

        const lowerMsg = message.toLowerCase();
        let responseText = "I'm currently running in offline mode. I can help with basic stats like 'revenue', 'deals', or 'clients'.";

        if (lowerMsg.includes('revenue') || lowerMsg.includes('sales') || lowerMsg.includes('money')) {
            responseText = `Based on your closed deals, the total revenue is ₹${totalRevenue.toLocaleString('en-IN')}.`;

        } else if (lowerMsg.includes('deal') || lowerMsg.includes('pipeline')) {
            responseText = `You have ${dealCount} deals in total, with ${activeCount} currently active in the pipeline.`;

        } else if (lowerMsg.includes('customer') || lowerMsg.includes('client') || lowerMsg.includes('account')) {
            responseText = `There are currently ${accountCount} accounts in your client directory.`;

        } else if (lowerMsg.includes('contact') || lowerMsg.includes('people')) {
            responseText = `You have ${contactCount} contacts saved in the system.`;

        } else if (lowerMsg.includes('setting') || lowerMsg.includes('profile')) {
            responseText = "You can manage your profile and global configurations in the Settings page.";

        } else if (lowerMsg.includes('report') || lowerMsg.includes('export')) {
            responseText = "Head over to the 'Reports & Analytics' section to generate CSV exports.";

        } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            responseText = "Hello! I am NexusAI. Ask me about your revenue or deals.";
        }

        res.json({ response: responseText });

    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ error: 'Failed to process AI request' });
    }
};
