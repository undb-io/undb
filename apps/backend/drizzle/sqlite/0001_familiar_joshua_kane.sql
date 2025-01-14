CREATE TABLE `undb_password_reset_token` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `undb_password_reset_token_token_unique` ON `undb_password_reset_token` (`token`);--> statement-breakpoint
CREATE INDEX `password_reset_token_user_id_idx` ON `undb_password_reset_token` (`user_id`);