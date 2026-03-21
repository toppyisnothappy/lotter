# Lotter - Modern Retail Management System

Lotter is a high-performance, multi-tenant retail management platform designed to handle complex inventory, credit sales, and customer installment debts with a premium, glassmorphic UI.

## 🚀 Key Features

- **High-Performance POS**: Sub-second product search, barcode scanning, and rapid checkout.
- **Customer CRM**: Detailed debt tracking, credit management, and LINE ID integration for payment reminders.
- **Multi-Tenant Architecture**: Support for multiple organizations with separate data silos and staff roles (Owner, Clerk).
- **Flexible Payments**: Support for cash, card, and multi-month installment plans with automated scheduling.
- **Debt Integrity**: Atomic transaction logs and debt calculations ensuring 100% data consistency.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MySQL](https://www.mysql.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Auth.js](https://authjs.dev/) (NextAuth v5 Beta)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 📦 Getting Started

### 1. Prerequisites

- **Node.js**: 20.x or higher
- **MySQL**: 8.x or higher
- **PackageManager**: `npm` recommended

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd lotter

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# MySQL Connection
DATABASE_URL=mysql://root:password@127.0.0.1:3306/lotter

# Auth.js
AUTH_SECRET=your_auth_secret
AUTH_URL=http://localhost:3000
```

### 4. Database Setup

Lotter uses Drizzle for schema management and migrations.

```bash
# Push schema to database
npx drizzle-kit push
```

### 5. Running Locally

```bash
# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## 🏗️ Architecture (FSD-lite)

The project follows a modular structure inspired by Feature-Sliced Design:

- `src/app`: Next.js App Router (Routes & Layouts)
- `src/features`: Business logic slices (auth, inventory, pos, crm)
- `src/entities`: Domain entities (user, product, customer, organization)
- `src/shared`: Reusable components, hooks, and lib (db, line-api)
- `conductor/`: Project management and track tracking (internal workflow)

## 🛤️ Conductor Workflow

Lotter uses **Conductor**, a structured project management system for AI agents.

- **Check Status**: `conductor-status`
- **New Feature**: `/conductor:new-track "description"`
- **Implementation**: `/conductor:implement {trackId}`

Current active tracks and project roadmap can be found in `conductor/tracks.md`.

## 🔒 Security & Authorization

- **Session Management**: Handled via Auth.js with MySQL adapter.
- **Route Protection**: Next.js middleware enforces authentication before accessing any `/pos`, `/inventory`, or `/customers` path.
- **Role-Based Access**: Permission-controlled actions for Owners vs Clerks.

## 📋 License

This project is proprietary and for internal use only.
