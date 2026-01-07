CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`targetAudience` varchar(100),
	`subject` varchar(255),
	`content` text,
	`status` enum('draft','scheduled','sent') NOT NULL DEFAULT 'draft',
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leadActivities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`activityType` varchar(100) NOT NULL,
	`activityData` text,
	`points` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leadActivities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`phone` varchar(50),
	`profession` varchar(100),
	`practiceName` varchar(255),
	`location` varchar(255),
	`source` varchar(100),
	`sourceId` varchar(255),
	`engagementScore` int NOT NULL DEFAULT 0,
	`lastActivityAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`),
	CONSTRAINT `leads_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `qrCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`pharmacyName` varchar(255) NOT NULL,
	`pharmacyEmail` varchar(320),
	`pharmacyPhone` varchar(50),
	`pharmacyAddress` varchar(500),
	`scans` int NOT NULL DEFAULT 0,
	`lastScannedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `qrCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `qrCodes_code_unique` UNIQUE(`code`)
);
