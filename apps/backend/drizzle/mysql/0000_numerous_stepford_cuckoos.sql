CREATE TABLE `undb_api_token` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	`token` varchar(36) NOT NULL,
	CONSTRAINT `undb_api_token_id` PRIMARY KEY(`id`),
	CONSTRAINT `undb_api_token_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `undb_attachment_mapping` (
	`attachment_id` varchar(36) NOT NULL,
	`table_id` varchar(36) NOT NULL,
	`record_id` varchar(36) NOT NULL,
	`field_id` varchar(36) NOT NULL,
	CONSTRAINT `pk` PRIMARY KEY(`attachment_id`,`table_id`,`record_id`,`field_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_attachment` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`size` int NOT NULL,
	`mime_type` varchar(255) NOT NULL,
	`url` varchar(255) NOT NULL,
	`token` varchar(36),
	`created_at` bigint NOT NULL,
	`created_by` varchar(36) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	CONSTRAINT `undb_attachment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `undb_audit` (
	`id` varchar(36) NOT NULL,
	`timestamp` bigint NOT NULL,
	`detail` json,
	`meta` json,
	`op` text NOT NULL,
	`table_id` varchar(36) NOT NULL,
	`record_id` varchar(36) NOT NULL,
	`operator_id` varchar(36) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	CONSTRAINT `undb_audit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `undb_base` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	`created_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`created_by` varchar(36) NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` varchar(36) NOT NULL,
	CONSTRAINT `undb_base_id` PRIMARY KEY(`id`),
	CONSTRAINT `base_name_unique_idx` UNIQUE(`name`,`space_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_dashboard_table_id_mapping` (
	`dashboard_id` varchar(36) NOT NULL,
	`table_id` varchar(36) NOT NULL,
	CONSTRAINT `pk` PRIMARY KEY(`dashboard_id`,`table_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_dashboard` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`base_id` varchar(36) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	`widgets` json,
	`layout` json,
	`created_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`created_by` varchar(36) NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` varchar(36) NOT NULL,
	CONSTRAINT `undb_dashboard_id` PRIMARY KEY(`id`),
	CONSTRAINT `dashboard_name_unique_idx` UNIQUE(`name`,`base_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_email_verification_code` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` text NOT NULL,
	`user_id` varchar(36),
	`email` text NOT NULL,
	`expires_at` bigint NOT NULL,
	CONSTRAINT `undb_email_verification_code_id` PRIMARY KEY(`id`),
	CONSTRAINT `undb_email_verification_code_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_invitation` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`role` text NOT NULL,
	`status` text NOT NULL,
	`space_id` varchar(36) NOT NULL,
	`invited_at` bigint NOT NULL,
	`inviter_id` varchar(36) NOT NULL,
	CONSTRAINT `undb_invitation_id` PRIMARY KEY(`id`),
	CONSTRAINT `invitation_unique_idx` UNIQUE(`email`,`space_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_oauth_account` (
	`provider_id` varchar(36) NOT NULL,
	`provider_user_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `undb_oauth_account_provider_id_provider_user_id_pk` PRIMARY KEY(`provider_id`,`provider_user_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_outbox` (
	`id` varchar(36) NOT NULL,
	`payload` json NOT NULL,
	`meta` json,
	`timestamp` bigint NOT NULL,
	`user_id` varchar(36),
	`name` text NOT NULL,
	`space_id` varchar(36) NOT NULL,
	CONSTRAINT `undb_outbox_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `undb_password_reset_token` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`expires_at` bigint NOT NULL,
	CONSTRAINT `undb_password_reset_token_id` PRIMARY KEY(`id`),
	CONSTRAINT `undb_password_reset_token_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `undb_reference_id_mapping` (
	`field_id` varchar(36) NOT NULL,
	`table_id` varchar(36) NOT NULL,
	`symmetric_field_id` varchar(36),
	`foreign_table_id` varchar(36) NOT NULL,
	CONSTRAINT `reference_id_mapping_unique_idx` UNIQUE(`field_id`,`table_id`,`symmetric_field_id`,`foreign_table_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_rollup_id_mapping` (
	`field_id` varchar(36) NOT NULL,
	`table_id` varchar(36) NOT NULL,
	`rollup_id` varchar(36) NOT NULL,
	`rollup_table_id` varchar(36) NOT NULL,
	CONSTRAINT `undb_rollup_id_mapping_field_id_rollup_id_pk` PRIMARY KEY(`field_id`,`rollup_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_session` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`space_id` varchar(36) NOT NULL,
	CONSTRAINT `undb_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `undb_share` (
	`id` varchar(36) NOT NULL,
	`target_type` varchar(255) NOT NULL,
	`target_id` varchar(36) NOT NULL,
	`enabled` boolean NOT NULL,
	`space_id` varchar(36) NOT NULL,
	CONSTRAINT `undb_share_id` PRIMARY KEY(`id`),
	CONSTRAINT `share_unique_idx` UNIQUE(`target_type`,`target_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_space` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255),
	`is_personal` boolean NOT NULL,
	`avatar` text,
	`created_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`created_by` varchar(36) NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` varchar(36) NOT NULL,
	`deleted_at` bigint,
	`deleted_by` varchar(36),
	CONSTRAINT `undb_space_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `undb_space_member` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`role` text NOT NULL,
	`space_id` varchar(36) NOT NULL,
	CONSTRAINT `undb_space_member_id` PRIMARY KEY(`id`),
	CONSTRAINT `space_member_unique_idx` UNIQUE(`user_id`,`space_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_table_id_mapping` (
	`table_id` varchar(36) NOT NULL,
	`subject_id` varchar(36) NOT NULL,
	CONSTRAINT `undb_table_id_mapping_table_id_subject_id_pk` PRIMARY KEY(`table_id`,`subject_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_table` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`base_id` varchar(36) NOT NULL,
	`space_id` varchar(36) NOT NULL,
	`schema` json NOT NULL,
	`views` json NOT NULL,
	`forms` json,
	`rls` json,
	`widgets` json,
	`created_at` text NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`created_by` varchar(36) NOT NULL,
	`updated_at` text NOT NULL,
	`updated_by` varchar(36) NOT NULL,
	CONSTRAINT `undb_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `table_name_unique_idx` UNIQUE(`name`,`base_id`)
);
--> statement-breakpoint
CREATE TABLE `undb_user` (
	`id` varchar(36) NOT NULL,
	`username` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`password` text NOT NULL,
	`avatar` text,
	`otp_secret` text,
	CONSTRAINT `undb_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `undb_user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `undb_webhook` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`url` varchar(255) NOT NULL,
	`method` text NOT NULL,
	`enabled` boolean NOT NULL,
	`table_id` varchar(36) NOT NULL,
	`headers` json NOT NULL,
	`condition` json,
	`event` text NOT NULL,
	`space_id` varchar(36) NOT NULL,
	CONSTRAINT `undb_webhook_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `undb_api_token` ADD CONSTRAINT `undb_api_token_user_id_undb_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_api_token` ADD CONSTRAINT `undb_api_token_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_attachment_mapping` ADD CONSTRAINT `undb_attachment_mapping_attachment_id_undb_attachment_id_fk` FOREIGN KEY (`attachment_id`) REFERENCES `undb_attachment`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_attachment_mapping` ADD CONSTRAINT `undb_attachment_mapping_table_id_undb_table_id_fk` FOREIGN KEY (`table_id`) REFERENCES `undb_table`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_attachment` ADD CONSTRAINT `undb_attachment_created_by_undb_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_attachment` ADD CONSTRAINT `undb_attachment_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_audit` ADD CONSTRAINT `undb_audit_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_base` ADD CONSTRAINT `undb_base_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_base` ADD CONSTRAINT `undb_base_created_by_undb_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_base` ADD CONSTRAINT `undb_base_updated_by_undb_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_dashboard_table_id_mapping` ADD CONSTRAINT `dashboard_table_id_mapping_dashboard_id_fk` FOREIGN KEY (`dashboard_id`) REFERENCES `undb_dashboard`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_dashboard_table_id_mapping` ADD CONSTRAINT `dashboard_table_id_mapping_table_id_fk` FOREIGN KEY (`table_id`) REFERENCES `undb_table`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_dashboard` ADD CONSTRAINT `undb_dashboard_base_id_undb_base_id_fk` FOREIGN KEY (`base_id`) REFERENCES `undb_base`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_dashboard` ADD CONSTRAINT `undb_dashboard_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_dashboard` ADD CONSTRAINT `undb_dashboard_created_by_undb_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_dashboard` ADD CONSTRAINT `undb_dashboard_updated_by_undb_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_email_verification_code` ADD CONSTRAINT `undb_email_verification_code_user_id_undb_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_invitation` ADD CONSTRAINT `undb_invitation_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_invitation` ADD CONSTRAINT `undb_invitation_inviter_id_undb_user_id_fk` FOREIGN KEY (`inviter_id`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_oauth_account` ADD CONSTRAINT `undb_oauth_account_user_id_undb_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_outbox` ADD CONSTRAINT `undb_outbox_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_password_reset_token` ADD CONSTRAINT `undb_password_reset_token_user_id_undb_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_session` ADD CONSTRAINT `undb_session_user_id_undb_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_session` ADD CONSTRAINT `undb_session_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_share` ADD CONSTRAINT `undb_share_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_space` ADD CONSTRAINT `undb_space_created_by_undb_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_space` ADD CONSTRAINT `undb_space_updated_by_undb_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_space` ADD CONSTRAINT `undb_space_deleted_by_undb_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_space_member` ADD CONSTRAINT `undb_space_member_user_id_undb_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_space_member` ADD CONSTRAINT `undb_space_member_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_table_id_mapping` ADD CONSTRAINT `table_id_mapping_table_id_fk` FOREIGN KEY (`table_id`) REFERENCES `undb_table`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_table` ADD CONSTRAINT `undb_table_base_id_undb_base_id_fk` FOREIGN KEY (`base_id`) REFERENCES `undb_base`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_table` ADD CONSTRAINT `undb_table_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_table` ADD CONSTRAINT `undb_table_created_by_undb_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_table` ADD CONSTRAINT `undb_table_updated_by_undb_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `undb_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_webhook` ADD CONSTRAINT `undb_webhook_table_id_undb_table_id_fk` FOREIGN KEY (`table_id`) REFERENCES `undb_table`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `undb_webhook` ADD CONSTRAINT `undb_webhook_space_id_undb_space_id_fk` FOREIGN KEY (`space_id`) REFERENCES `undb_space`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `api_token_space_id_idx` ON `undb_api_token` (`space_id`);--> statement-breakpoint
CREATE INDEX `api_token_user_id_idx` ON `undb_api_token` (`user_id`);--> statement-breakpoint
CREATE INDEX `attachment_size_idx` ON `undb_attachment` (`size`);--> statement-breakpoint
CREATE INDEX `attachment_space_id_idx` ON `undb_attachment` (`space_id`);--> statement-breakpoint
CREATE INDEX `audit_table_id_idx` ON `undb_audit` (`table_id`);--> statement-breakpoint
CREATE INDEX `audit_space_id_idx` ON `undb_audit` (`space_id`);--> statement-breakpoint
CREATE INDEX `audit_record_id_idx` ON `undb_audit` (`record_id`);--> statement-breakpoint
CREATE INDEX `base_space_id_idx` ON `undb_base` (`space_id`);--> statement-breakpoint
CREATE INDEX `dashboard_base_id_idx` ON `undb_dashboard` (`base_id`);--> statement-breakpoint
CREATE INDEX `dashboard_space_id_idx` ON `undb_dashboard` (`space_id`);--> statement-breakpoint
CREATE INDEX `invitation_space_id_idx` ON `undb_invitation` (`space_id`);--> statement-breakpoint
CREATE INDEX `outbox_space_id_idx` ON `undb_outbox` (`space_id`);--> statement-breakpoint
CREATE INDEX `password_reset_token_user_id_idx` ON `undb_password_reset_token` (`user_id`);--> statement-breakpoint
CREATE INDEX `share_space_id_idx` ON `undb_share` (`space_id`);--> statement-breakpoint
CREATE INDEX `space_name_idx` ON `undb_space` (`name`);--> statement-breakpoint
CREATE INDEX `table_base_id_idx` ON `undb_table` (`base_id`);--> statement-breakpoint
CREATE INDEX `table_space_id_idx` ON `undb_table` (`space_id`);--> statement-breakpoint
CREATE INDEX `user_username_idx` ON `undb_user` (`username`);--> statement-breakpoint
CREATE INDEX `user_email_idx` ON `undb_user` (`email`);--> statement-breakpoint
CREATE INDEX `webhook_table_id_idx` ON `undb_webhook` (`table_id`);--> statement-breakpoint
CREATE INDEX `webhook_space_id_idx` ON `undb_webhook` (`space_id`);--> statement-breakpoint
CREATE INDEX `webhook_url_idx` ON `undb_webhook` (`url`);