CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`clinicianId` int NOT NULL,
	`scheduledAt` timestamp NOT NULL,
	`duration` int NOT NULL DEFAULT 30,
	`status` enum('scheduled','in_progress','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled',
	`appointmentType` enum('initial','follow_up','emergency') NOT NULL DEFAULT 'initial',
	`videoRoomUrl` varchar(500),
	`googleCalendarEventId` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medicalRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`clinicianId` int NOT NULL,
	`appointmentId` int,
	`recordType` enum('consultation_note','progress_note','lab_result','imaging','other') NOT NULL DEFAULT 'consultation_note',
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`attachments` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `medicalRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromUserId` int NOT NULL,
	`toUserId` int NOT NULL,
	`subject` varchar(255),
	`content` text NOT NULL,
	`isRead` int NOT NULL DEFAULT 0,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prescriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`clinicianId` int NOT NULL,
	`medicationName` varchar(255) NOT NULL,
	`genericName` varchar(255),
	`dosage` varchar(100) NOT NULL,
	`frequency` varchar(100) NOT NULL,
	`instructions` text,
	`quantity` int,
	`refills` int NOT NULL DEFAULT 0,
	`prescribedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
	`eToken` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prescriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','patient','clinician') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `dateOfBirth` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `medicalHistory` text;--> statement-breakpoint
ALTER TABLE `users` ADD `ahpraNumber` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `specialization` varchar(255);