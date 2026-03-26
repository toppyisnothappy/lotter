# Implementation Plan - Lotter (SaaS Retail POS)

## Goal
Build a premium, multi-tenant SaaS Retail POS system that supports manual business approval and customer installment tracking using Next.js 15 and Supabase.

## 👥 Role-Based Task Assignment

### 🏗️ Backend Engineer (Subabase & Core Logic)
*Responsible for infrastructure, security, and data integrity.*

- **Phase 1: Foundation**
    - [x] Create SQL migrations for `organizations`, `profiles`, and `products`.
    - [x] Configure Supabase Row Level Security (RLS) policies for multi-tenant isolation.
    - [x] Set up Auth Triggers to automatically link new users to `profiles`.
- **Phase 2 & 3: Business Logic**
    - [ ] Role-based access control (Owner vs. Clerk) logic in RLS.
    - [ ] Inventory Engine: SKU tracking and stock decrement logic.
    - [ ] Transaction processing: `transaction_items` breakdown and total calculation.
- **Phase 4: Debt & Credit Logic**
    - [ ] Create PostgreSQL View for `outstanding_debt` (Total - Payments).
    - [ ] Build "Payment Entry" module with immutable audit logs.
- **Phase 5: Performance**
    - [ ] Database index optimization for high-speed POS searching.

### 💻 Frontend Engineer (Next.js & POS Experience)
*Responsible for the application structure, state management, and POS performance.*

- **Phase 1: Setup**
    - [x] Initialize Next.js 15 project with Feature-Sliced Design (FSD) structure. (Done)
    - [x] Implement multi-tenant routing handlers. (Done)
- **Phase 2: Store Management**
    - [x] Approved user onboarding flow (Store profile setup). (Done - Shell)
    - [x] Inventory Management CRUD interfaces. (Done)
    - [x] Customer CRM: Profiles with credit tracking UI. (Done)
- **Phase 3: The Engine (POS)**
    - [ ] High-performance "Search & Add" interface using Zustand.
    - [ ] Keyboard shortcut support (F1 for search, etc.).
    - [ ] Browser-based PDF receipt generation and printing.
- **Phase 4: Collections**
    - [ ] Debt management dashboard for store owners.
    - [ ] Partial payment flow integration in the cart.
- **Phase 5: Analytics**
    - [ ] Dashboard tiles for Daily/Monthly sales.
    - [ ] Exportable CSV reporting engine.

### 🎨 UI/UX Designer & Polish Specialist
*Responsible for the "Premium" feel, branding, and final user experience.*

- **Phase 1: Attraction**
    - [x] Implement "Request Account" landing page with a premium dark-mode aesthetic. (Done)
    - [x] Build **Super Admin Dashboard** UI for the approval workflow. (Done)
- **Phase 5: The "Wow" Factor**
    - [ ] Apply final HSL palette and unified design tokens.
    - [ ] Implement Glassmorphism effects and subtle micro-animations.
    - [ ] Performance audit and accessibility sweep (WCAG compliance).

