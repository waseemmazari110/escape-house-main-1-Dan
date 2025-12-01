ALTER TABLE `properties` ADD `owner_id` text REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'guest' NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `user` ADD `company_name` text;