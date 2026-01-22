CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`resourceType` varchar(50) NOT NULL,
	`resourceId` varchar(255),
	`metadata` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `processedWebhooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` varchar(255) NOT NULL,
	`provider` varchar(50) NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`status` enum('processing','completed','failed') NOT NULL DEFAULT 'processing',
	`payload` json,
	`errorMessage` text,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	`processedAt` timestamp,
	CONSTRAINT `processedWebhooks_id` PRIMARY KEY(`id`),
	CONSTRAINT `processedWebhooks_eventId_unique` UNIQUE(`eventId`)
);
--> statement-breakpoint
ALTER TABLE `appointments` MODIFY COLUMN `status` enum('pending_payment','scheduled','in_progress','completed','cancelled','no_show') NOT NULL DEFAULT 'pending_payment';--> statement-breakpoint
ALTER TABLE `appointments` ADD `deletedAt` timestamp;