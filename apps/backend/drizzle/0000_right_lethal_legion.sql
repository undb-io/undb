CREATE TABLE `undb_api_token` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `undb_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`timestamp` integer NOT NULL,
	`detail` text,
	`meta` text,
	`op` text NOT NULL,
	`table_id` text NOT NULL,
	`record_id` text NOT NULL,
	`operator_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `undb_base` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`created_by` text NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `undb_invitation` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`status` text NOT NULL,
	`invited_at` integer NOT NULL,
	`inviter_id` text NOT NULL,
	FOREIGN KEY (`inviter_id`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `undb_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`meta` text,
	`timestamp` integer NOT NULL,
	`operator_id` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `undb_reference_id_mapping` (
	`field_id` text NOT NULL,
	`table_id` text NOT NULL,
	`symmetric_field_id` text NOT NULL,
	`foreign_table_id` text NOT NULL,
	FOREIGN KEY (`table_id`) REFERENCES `undb_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`foreign_table_id`) REFERENCES `undb_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `undb_rollup_id_mapping` (
	`field_id` text NOT NULL,
	`table_id` text NOT NULL,
	`rollup_id` text NOT NULL,
	`rollup_table_id` text NOT NULL,
	PRIMARY KEY(`field_id`, `rollup_id`),
	FOREIGN KEY (`table_id`) REFERENCES `undb_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`rollup_table_id`) REFERENCES `undb_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `undb_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `undb_share` (
	`id` text PRIMARY KEY NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`enabled` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `undb_table_id_mapping` (
	`table_id` text NOT NULL,
	`subject_id` text NOT NULL,
	PRIMARY KEY(`subject_id`, `table_id`),
	FOREIGN KEY (`table_id`) REFERENCES `undb_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `undb_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`base_id` text NOT NULL,
	`schema` text NOT NULL,
	`views` text NOT NULL,
	`forms` text,
	`rls` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`created_by` text NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`base_id`) REFERENCES `undb_base`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `undb_user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `undb_webhook` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`method` text NOT NULL,
	`enabled` integer NOT NULL,
	`table_id` text NOT NULL,
	`headers` text NOT NULL,
	`condition` text,
	`event` text NOT NULL,
	FOREIGN KEY (`table_id`) REFERENCES `undb_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `undb_workspace_member` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `undb_api_token_user_id_unique` ON `undb_api_token` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `undb_api_token_token_unique` ON `undb_api_token` (`token`);--> statement-breakpoint
CREATE INDEX `audit_table_id_idx` ON `undb_audit` (`table_id`);--> statement-breakpoint
CREATE INDEX `audit_record_id_idx` ON `undb_audit` (`record_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `undb_base_name_unique` ON `undb_base` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `undb_invitation_email_unique` ON `undb_invitation` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `reference_id_mapping_unique_idx` ON `undb_reference_id_mapping` (`field_id`,`table_id`,`symmetric_field_id`,`foreign_table_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `share_unique_idx` ON `undb_share` (`target_type`,`target_id`);--> statement-breakpoint
CREATE INDEX `table_base_id_idx` ON `undb_table` (`base_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `table_name_unique_idx` ON `undb_table` (`name`,`base_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `undb_user_email_unique` ON `undb_user` (`email`);--> statement-breakpoint
CREATE INDEX `user_username_idx` ON `undb_user` (`username`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `undb_user` (`email`);--> statement-breakpoint
CREATE INDEX `webhook_table_id_idx` ON `undb_webhook` (`table_id`);--> statement-breakpoint
CREATE INDEX `webhook_url_idx` ON `undb_webhook` (`url`);