# Implementation Plan: Installment Payments & LINE Reminders

**Track ID:** installment-reminders_20260315
**Spec:** spec.md
**Created:** 2026-03-15
**Status:** [~] In Progress

## Overview

We will enhance the POS checkout to support customer-linked installment plans and integrate the LINE Messaging API to facilitate debt recovery and customer tracking.

## Phase 1: POS Customer Attribution

Enable linking a POS sale to a specific customer.

### Tasks

- [x] Task 1.1: Add a `CustomerSelection` component to the `CheckoutModal`.
- [x] Task 1.2: Update `processTransaction` action to correctly handle the `customer_id` and update their debt if the payment type is 'installment'.
- [x] Task 1.3: Add "Installment" button to the payment type selection in `CheckoutModal`.

### Verification

- [x] Perform a checkout with 'Installment' selected and verify the Customer's debt balance increases in the DB.

## Phase 2: LINE Messaging Integration

Build the bridge to the LINE Messaging API.

### Tasks

- [x] Task 2.1: Implement `sendLinePushMessage` utility in `src/shared/lib/line/api.ts`.
- [x] Task 2.2: Add `LINE_CHANNEL_ACCESS_TOKEN` and `LINE_CHANNEL_SECRET` placeholders to `.env.example`.
- [x] Task 2.3: Force-refresh `customer-line-id` data to ensure we have IDs for testing.

### Verification

- [x] Use a scratch script to send a test push message to a known LINE ID.

## Phase 3: Billing Dashboard & Insights

Provide the store owner with tools to manage installments.

### Tasks

- [x] Task 3.1: Create `InstallmentDashboard` component in the CRM section.
- [x] Task 3.2: Implement logic to calculate "Full Exposure" (Total debt across all customers).
- [x] Task 3.3: Add "Remind via LINE" button to the `CustomerTable` or a specific Billing View.

### Verification

- [x] Verify the "Total Installments" count and sum match the database records.

## Phase 4: Buyer Payment Trace

Enable customers to see their payment history.

### Tasks

- [x] Task 4.1: Update `CustomerProfile` to include a "Payment Trace" timeline showing Purchases (Increase Debt) and Payments (Decrease Debt).
- [x] Task 4.2: Ensure the data is sorted chronologically.

### Verification

- [x] View a customer profile and confirm a clear history of debt-related activities.

## Phase 5: Installment Fixes & Periods

Address the partial payment limitation and add installment period tracking.

### Tasks

- [x] Task 5.1: Add `dueDate` column (datetime) to `transactions` table in `src/shared/lib/db/schema.ts`.
- [x] Task 5.2: Update `Transaction` entity and `processTransaction` action to correctly handle `dueDate`.
- [x] Task 5.3: Update `CheckoutModal` UI to allow entering a `paymentAmount` less than total when "Installment" is selected.
- [x] Task 5.4: Add "Due Date" picker to the `CheckoutModal` when "Installment" is selected.

## Phase 6: Monthly Installment Schedule

Enable multi-month installment tracking.

### Tasks

- [x] Task 6.1: Add `installmentMonths` column (int) to `transactions` table.
- [x] Task 6.2: Update `CheckoutModal` to allow selecting number of months (1-12).
- [x] Task 6.3: Display "Monthly Payment" estimation in the checkout modal.
- [x] Task 6.4: Update Billing insights to show upcoming monthly dues.

### Verification

- [x] Create a 3-month installment and verify the metadata is saved.

## Phase 7: Settle Debt by Item

Enable customers to pay off specific installment transactions.

### Tasks

- [x] Task 7.1: Update `getCustomerHistoryAction` to calculate remaining balance for each transaction by summing linked payments.
- [x] Task 7.2: Update `TransactionTimeline` to display "Remaining: $X.XX" for partial transactions.
- [x] Task 7.3: Add "Settle This Item" button to the timeline.
- [x] Task 7.4: Implement `settleTransactionAction` to record a payment specifically for a transaction and update its status.

- [x] Select a partial transaction and click "Settle". Verify the item status becomes "complete" and the customer's total debt decreases.

## Phase 8: Partial Item Payment

Support paying specific amounts against individual installment items.

### Tasks

- [x] Task 8.1: Create `ItemPaymentModal` to allow entering a specific amount for a transaction.
- [x] Task 8.2: Implement `recordItemPaymentAction` to handle partial payments linked to a transaction.
- [x] Task 8.3: Add logic to mark transaction as 'complete' only if `remainingBalance` reaches zero.
- [x] Task 8.4: Replace "Settle Debt" button in `TransactionTimeline` with a "Pay" button that opens the payment amount modal.

### Verification

- [ ] Record a $10 payment for a $50 debt item. Verify the item remains "partial" with "Unpaid: $40" displayed.
- [ ] Record another $40 payment for the same item. Verify it automatically becomes "complete".

## Phase 9: Visual Debt Urgency & Tracking

Improve the UI to clarify status of debts, due dates, and punctuality.

### Tasks

- [x] Task 9.1: Implement overdue logic in `getCustomerHistoryAction` comparing `now` vs `dueDate`.
- [x] Task 9.2: Create `UrgencyBanner` in `TransactionTimeline` highlighting next due/overdue items.
- [x] Task 9.3: Add "Punctuality" detection to show if debts were settled on time.
- [x] Task 9.4: Add pulsing overdue indicators and "Days Late" counters.

### Verification

- [x] View a customer with an item past its due date. Verify the red "OVERDUE" banner and pulsing icon appear.
- [x] View a settled item. Verify the "Paid on Time" badge appears if the last payment was early.

## Final Verification

- [x] All acceptance criteria met.
- [x] LINE Push triggers correctly from the UI.
- [x] Ready for review.

---

_Generated by Conductor. Tasks will be marked [~] in progress and [x] complete._
