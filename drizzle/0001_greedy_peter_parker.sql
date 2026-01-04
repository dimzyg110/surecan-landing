CREATE TABLE `educationProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`sectionName` varchar(255) NOT NULL,
	`completed` int NOT NULL DEFAULT 0,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `educationProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientName` varchar(255) NOT NULL,
	`patientEmail` varchar(320),
	`patientPhone` varchar(50),
	`patientDob` varchar(20),
	`referrerType` enum('gp','pharmacist','allied_health') NOT NULL,
	`referrerName` varchar(255) NOT NULL,
	`referrerEmail` varchar(320) NOT NULL,
	`referrerPhone` varchar(50),
	`referrerPracticeName` varchar(255),
	`clinicalIndication` text NOT NULL,
	`currentMedications` text,
	`relevantHistory` text,
	`urgency` enum('routine','urgent','emergency') NOT NULL DEFAULT 'routine',
	`status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
