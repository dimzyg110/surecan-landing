ALTER TABLE `referrals` MODIFY COLUMN `status` enum('pending','contacted','booked','completed','cancelled') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `referrals` ADD `referralId` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `referrals` ADD `patientId` varchar(50);--> statement-breakpoint
ALTER TABLE `referrals` ADD `uniqueBookingLink` varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE `referrals` ADD `prescriberId` int;--> statement-breakpoint
ALTER TABLE `referrals` ADD `pharmacyId` int;--> statement-breakpoint
ALTER TABLE `referrals` ADD `bookingCompletedAt` timestamp;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_referralId_unique` UNIQUE(`referralId`);--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_uniqueBookingLink_unique` UNIQUE(`uniqueBookingLink`);