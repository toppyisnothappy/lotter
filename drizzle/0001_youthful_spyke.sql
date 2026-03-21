ALTER TABLE `transactions` ADD `due_date` datetime;--> statement-breakpoint
ALTER TABLE `transactions` ADD `installment_months` int DEFAULT 1;