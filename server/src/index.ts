import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getContacts, createContact, updateContact, deleteContact } from './controllers/contactController';
import { getAccounts, createAccount, updateAccount, deleteAccount, importAccounts } from './controllers/accountController';
import { getDeals, createDeal, updateDeal, deleteDeal } from './controllers/dealController';
import { getWorkflows, createWorkflow, deleteWorkflow } from './controllers/workflowController';
import { getActivities } from './controllers/activityController';
import { getDashboardStats } from './controllers/statsController';
import { createOrder, verifyPayment } from './controllers/paymentController';
import { register, login, getMe } from './controllers/authController';
import { authenticate } from './middleware/authMiddleware';

const app = express();
import helmet from 'helmet';
app.use(helmet());
app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', authenticate, getMe);

// Protected Routes
app.use('/api', authenticate); // Apply auth to all subsequent api routes

// Accounts
app.get('/api/accounts', getAccounts);
app.post('/api/accounts', createAccount);
app.post('/api/accounts/import', importAccounts);
app.put('/api/accounts/:id', updateAccount);
app.delete('/api/accounts/:id', deleteAccount);

// Contacts
app.get('/api/contacts', getContacts);
app.post('/api/contacts', createContact);
app.put('/api/contacts/:id', updateContact);
app.delete('/api/contacts/:id', deleteContact);

app.get('/api/deals', getDeals);
app.post('/api/deals', createDeal);
app.put('/api/deals/:id', updateDeal);
app.delete('/api/deals/:id', deleteDeal);

app.get('/api/activities', getActivities);
app.get('/api/stats', getDashboardStats);

// Search
import { searchGlobal } from './controllers/searchController';
app.get('/api/search', searchGlobal);

// AI Chat
import { chatWithAI } from './controllers/aiController';
app.post('/api/ai/chat', authenticate, chatWithAI);

// Payment Routes (Maybe protected?)
app.post('/api/orders', createOrder);
app.post('/api/verify', verifyPayment);

// Workflows
app.get('/api/workflows', getWorkflows);
app.post('/api/workflows', createWorkflow);
app.delete('/api/workflows/:id', deleteWorkflow);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
