import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create demo organization
    const org = await prisma.organization.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: 'Demo Organization',
            plan: 'pro'
        }
    });

    console.log('Created organization:', org.name);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@crm.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@crm.com',
            password: adminPassword,
            role: 'admin',
            organizationId: org.id
        }
    });

    console.log('Created admin user:', admin.email);

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@crm.com' },
        update: {},
        create: {
            name: 'Regular User',
            email: 'user@crm.com',
            password: userPassword,
            role: 'user',
            organizationId: org.id
        }
    });

    console.log('Created regular user:', user.email);

    // Create demo accounts
    const accountsData = [
        { name: 'Acme Corporation', industry: 'Technology', website: 'https://acme.com', address: 'Mumbai, India' },
        { name: 'Global Industries', industry: 'Manufacturing', website: 'https://global-ind.com', address: 'Delhi, India' },
        { name: 'Tech Innovators', industry: 'Software', website: 'https://techinnovators.io', address: 'Bangalore, India' },
        { name: 'Sunrise Enterprises', industry: 'Retail', website: 'https://sunrise.in', address: 'Chennai, India' },
        { name: 'Digital Solutions', industry: 'IT Services', website: 'https://digitalsol.com', address: 'Hyderabad, India' }
    ];

    const createdAccounts = [];
    for (const acc of accountsData) {
        const account = await prisma.account.upsert({
            where: { name_organizationId: { name: acc.name, organizationId: org.id } },
            update: {},
            create: {
                ...acc,
                organizationId: org.id
            }
        });
        createdAccounts.push(account);
    }

    console.log('Created demo accounts');

    // Create demo contacts
    const contactsData = [
        { name: 'Rahul Sharma', email: 'rahul@acme.com', phone: '+91 98765 43210', title: 'CEO', accountId: createdAccounts[0].id },
        { name: 'Priya Patel', email: 'priya@global-ind.com', phone: '+91 98765 43211', title: 'CTO', accountId: createdAccounts[1].id },
        { name: 'Amit Kumar', email: 'amit@techinnovators.io', phone: '+91 98765 43212', title: 'VP Sales', accountId: createdAccounts[2].id },
        { name: 'Sneha Gupta', email: 'sneha@sunrise.in', phone: '+91 98765 43213', title: 'Manager', accountId: createdAccounts[3].id },
        { name: 'Vikram Singh', email: 'vikram@digitalsol.com', phone: '+91 98765 43214', title: 'Director', accountId: createdAccounts[4].id },
        { name: 'Anita Desai', email: 'anita@acme.com', phone: '+91 98765 43215', title: 'CFO', accountId: createdAccounts[0].id }
    ];

    for (const contact of contactsData) {
        await prisma.contact.upsert({
            where: { email_organizationId: { email: contact.email, organizationId: org.id } },
            update: {},
            create: {
                ...contact,
                organizationId: org.id
            }
        });
    }

    console.log('Created demo contacts');

    // Create demo deals
    const dealsData = [
        { title: 'Enterprise License Deal', value: 500000, stage: 'Won', accountId: createdAccounts[0].id, winProbability: 1.0, aiInsight: 'Deal closed successfully!' },
        { title: 'Cloud Migration Project', value: 750000, stage: 'Negotiation', accountId: createdAccounts[1].id, winProbability: 0.7, aiInsight: 'High probability - focus on closing.' },
        { title: 'Software Development Contract', value: 300000, stage: 'New', accountId: createdAccounts[2].id, winProbability: 0.5, aiInsight: 'Standard deal progress.' },
        { title: 'Annual Maintenance Contract', value: 150000, stage: 'Won', accountId: createdAccounts[3].id, winProbability: 1.0, aiInsight: 'Recurring revenue secured.' },
        { title: 'Digital Transformation', value: 1200000, stage: 'Negotiation', accountId: createdAccounts[4].id, winProbability: 0.6, aiInsight: 'High value deal - requires executive attention.' },
        { title: 'Security Audit Services', value: 200000, stage: 'New', accountId: createdAccounts[0].id, winProbability: 0.4, aiInsight: 'New opportunity identified.' },
        { title: 'Data Analytics Platform', value: 450000, stage: 'Won', accountId: createdAccounts[1].id, winProbability: 1.0, aiInsight: 'Successfully delivered.' },
        { title: 'Mobile App Development', value: 350000, stage: 'Lost', accountId: createdAccounts[2].id, winProbability: 0.0, aiInsight: 'Lost to competitor.' },
        { title: 'ERP Implementation', value: 800000, stage: 'Negotiation', accountId: createdAccounts[3].id, winProbability: 0.65, aiInsight: 'In final negotiation stage.' },
        { title: 'IT Infrastructure Setup', value: 250000, stage: 'New', accountId: createdAccounts[4].id, winProbability: 0.3, aiInsight: 'Early stage opportunity.' }
    ];

    for (const deal of dealsData) {
        await prisma.deal.create({
            data: {
                ...deal,
                organizationId: org.id
            }
        });
    }

    console.log('Created demo deals');

    // Create demo activities
    const activitiesData = [
        { action: 'Created deal', target: 'Enterprise License Deal' },
        { action: 'Updated deal', target: 'Cloud Migration Project (Negotiation)' },
        { action: 'Added new contact', target: 'Rahul Sharma' },
        { action: 'Created account', target: 'Acme Corporation' },
        { action: 'Won deal', target: 'Annual Maintenance Contract' },
        { action: 'Created deal', target: 'Digital Transformation' },
        { action: 'Added new contact', target: 'Priya Patel' },
        { action: 'Updated account', target: 'Tech Innovators' },
        { action: 'Created deal', target: 'Security Audit Services' },
        { action: 'Lost deal', target: 'Mobile App Development' }
    ];

    for (const activity of activitiesData) {
        await prisma.activity.create({
            data: {
                ...activity,
                organizationId: org.id
            }
        });
    }

    console.log('Created demo activities');

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
