CREATE TABLE `crm_activity_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`activity_type` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`outcome` text,
	`performed_by` text,
	`metadata` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `crm_enquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text,
	`property_id` integer,
	`guest_name` text NOT NULL,
	`guest_email` text NOT NULL,
	`guest_phone` text,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`enquiry_type` text DEFAULT 'general' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`priority` text DEFAULT 'medium',
	`assigned_to` text,
	`source` text DEFAULT 'website',
	`check_in_date` text,
	`check_out_date` text,
	`number_of_guests` integer,
	`budget` real,
	`notes` text,
	`follow_up_date` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`closed_at` text,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `crm_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`note_type` text DEFAULT 'note',
	`title` text,
	`content` text NOT NULL,
	`priority` text DEFAULT 'normal',
	`due_date` text,
	`is_completed` integer DEFAULT false,
	`completed_at` text,
	`created_by` text,
	`assigned_to` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `crm_owner_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`business_name` text,
	`website` text,
	`address` text,
	`city` text,
	`state` text,
	`postal_code` text,
	`country` text DEFAULT 'UK',
	`alternate_phone` text,
	`alternate_email` text,
	`tax_id` text,
	`business_type` text,
	`registration_number` text,
	`preferred_contact_method` text DEFAULT 'email',
	`notes` text,
	`tags` text,
	`source` text DEFAULT 'website',
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `crm_owner_profiles_user_id_unique` ON `crm_owner_profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `crm_property_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`property_id` integer,
	`link_status` text DEFAULT 'active' NOT NULL,
	`ownership_type` text DEFAULT 'full',
	`commission_rate` real,
	`contract_start_date` text,
	`contract_end_date` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD `property_id` integer REFERENCES properties(id);