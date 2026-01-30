# Nexura CRM

Nexura is a modern, enterprise-grade Customer Relationship Management (CRM) platform designed for scalability and performance. Built with **React**, **Node.js**, **Express**, and **Prisma**, it features a comprehensive dashboard, deal pipeline, AI-powered assistant with real-time context, and global search capabilities.

[Nexura Dashboard](./client/public/vite.svg)

## 🚀 Key Features

-   **Dashboard**: Real-time overview of Revenue, Active Deals, and Client growth with currency support (INR).
-   **Deals Pipeline**: Visual Kanban-style tracking of deals across stages (Lead, Negotiation, Won).
-   **Global Search**: Unified search bar to query Accounts, Deals, and Contacts instantly.
-   **Nexura AI**: Context-aware AI assistant (powered by **Google Gemini**) that knows your live business stats and job openings.
-   **Team Management**: Admin-only section to manage team structure and roles.
-   **Reports & Analytics**: Visual charts for revenue forecasts and deal success rates.
-   **Careers Portal**: Public-facing page listing current job vacancies.
-   **Secure**: Enterprise-ready with Helmet headers, JWT authentication, and protected routes.

## 🛠️ Tech Stack

-   **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Recharts, Vite.
-   **Backend**: Node.js, Express, Prisma ORM, Google Generative AI SDK, Helmet.
-   **Database**: Compatible with PostgreSQL, MySQL, or SQLite (via Prisma).
-   **State Management**: React Context API for Auth and Theme.

## 📂 Project Structure

```
nexura-crm/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Layout, ChatWidget, etc.)
│   │   ├── pages/          # Application views (Dashboard, Deals, Careers)
│   │   ├── context/        # React Contexts (Auth, Theme)
│   │   └── App.tsx         # Main routing logic
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers (AI, Search, Deals)
│   │   ├── prisma/         # Database schema
│   │   └── index.ts        # Server entry point
└── README.md
```

## 🏁 Getting Started

### Prerequisites

-   Node.js (v18+)
-   npm or yarn
-   A running database instance (if using Postgre/MySQL)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/nexura-crm.git
    cd nexura-crm
    ```

2.  **Setup Server**
    ```bash
    cd server
    npm install
    cp .env.example .env
    ```
    
    Update `.env` with your configuration:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/nexura_db"
    JWT_SECRET="your_super_secret_key"
    GEMINI_API_KEY="your_google_ai_key"
    ```

    Run migrations and start server:
    ```bash
    npx prisma generate
    npx prisma db push
    npm run dev
    ```

3.  **Setup Client**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```

## 🤖 AI Features configuration

To enable the smart AI bot features:
1.  Obtain an API Key from [Google AI Studio](https://aistudio.google.com/).
2.  Add it to `server/.env` as `GEMINI_API_KEY`.
3.  The bot will automatically switch from "Offline Mode" (keyword matching) to "Online Mode" (Generative AI).


## 🚀 Deployment to Vercel

This project is configured for deployment on **Vercel** as a monorepo.

### Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **Cloud Database**: Vercel Serverless Functions are ephemeral, so **SQLite will not work**. You must use a cloud-hosted PostgreSQL database (e.g., [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)).

### Steps

1.  **Push to GitHub**: Ensure your code is pushed to a GitHub repository.
2.  **Import to Vercel**:
    *   Go to Vercel Dashboard -> "Add New..." -> "Project".
    *   Select your GitHub repository.
3.  **Configure Project**:
    *   **Framework Preset**: Vercel should auto-detect "Vite" for the client, but since this is a monorepo, it might need manual adjustments if not using the root `vercel.json`.
    *   **Root Directory**: Keep it as `./` (root).
    *   **Build Command**: Vercel will use the settings from `vercel.json`.
4.  **Environment Variables**:
    Add the following variables in the Vercel Project Settings -> Environment Variables:
    *   `DATABASE_URL`: Your cloud PostgreSQL connection string.
    *   `JWT_SECRET`: A secure random string.
    *   `GEMINI_API_KEY`: Your Google AI Studio key.
    *   `NODE_ENV`: Set to `production`.
5.  **Deploy**: Click "Deploy".

### Database Migration on Deployment

Since the database is cloud-hosted, you need to apply migrations from your local machine or a CI/CD pipeline:
```bash
# Update local .env to point to the production DB temporarily
# OR run explicitly:
DATABASE_URL="your_cloud_db_string" npx prisma migrate deploy --schema=./server/prisma/schema.prisma
```
