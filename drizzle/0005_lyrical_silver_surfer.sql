ALTER TABLE `appointments` ADD `stripePaymentIntentId` varchar(255);--> statement-breakpoint
ALTER TABLE `appointments` ADD `paymentStatus` enum('pending','paid','failed','refunded') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `appointments` ADD `amountPaid` int;