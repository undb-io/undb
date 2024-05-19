CREATE TABLE `undb_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `undb_user` ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `undb_user` ADD `password` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `undb_user_email_unique` ON `undb_user` (`email`);