# Design Document - Lotter SaaS POS

## 🛡️ Understanding Summary
*   **Target:** A multi-tenant SaaS Retail Point of Sale (POS) system.
*   **Core USP:** Built-in **Customer Credit & Installment** tracking for retail shops.
*   **Onboarding:** Manual approval flow for new businesses (Enterprise SaaS model).
*   **Accessibility:** Web-only, online-online (MVP).
*   **Hardware:** Software-only terminal (Digital receipts/peripherals via browser).

## 🏢 Tech Stack
*   **Framework:** Next.js 15 (App Router).
*   **Data & Auth:** Supabase (PostgreSQL with Row Level Security for multi-tenancy).
*   **UI/UX:** Tailwind CSS + Shadcn UI (Modern/Premium Aesthetics).
*   **State:** Zustand for the active checkout session.

## 📋 Data Schema Design
All tables (except `users` and `organizations`) include an `organization_id` for multi-tenant isolation.

### Core Tables
1.  **`organizations`**: Business profiles (name, slug, approval_status).
2.  **`products`**: Inventory (sku, price, stock_quantity, category).
3.  **`customers`**: Profiles for credit tracking (name, phone, total_balance).
4.  **`transactions`**: Sale headers (total, discount, status: `complete`, `partial`).
5.  **`payments`**: Individual payment records (amount, payment_type: `cash`, `card`, `installment`, timestamp). Link back to `transactions`.

## 💳 Payment & Installment Logic
*   **One-time:** Transaction created with matching total payment. Status: `complete`.
*   **Installments:** Transaction created with partial payment. Status: `partial`.
*   **Debt Tracking:** The system calculates `Remaining Balance = Transaction Total - Sum(Payments)`.
*   **Manual Entry:** Store owners manually record incoming installment payments against specific transactions.

## 🚦 Decision Log
| Decision | Choice | Rationale |
| :--- | :--- | :--- |
| **Multi-tenancy** | Shared Schema (RLS) | Cost-effective and scalable using Supabase Row Level Security. |
| **Hardware** | Software-Only MVP | Faster time to market; focuses on the software-as-a-service logic first. |
| **Approval Flow** | Manual Backend | Ensures quality control and professional verification of shops. |
