CREATE TABLE `undb_dashboard` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`base_id` text NOT NULL,
	`space_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`created_by` text NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`base_id`) REFERENCES `undb_base`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `dashboard_base_id_idx` ON `undb_dashboard` (`base_id`);--> statement-breakpoint
CREATE INDEX `dashboard_space_id_idx` ON `undb_dashboard` (`space_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `dashboard_name_unique_idx` ON `undb_dashboard` (`name`,`base_id`);