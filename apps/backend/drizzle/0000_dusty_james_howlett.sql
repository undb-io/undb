CREATE TABLE `undb_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`schema` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `undb_user` (
	`id` text PRIMARY KEY NOT NULL
);
