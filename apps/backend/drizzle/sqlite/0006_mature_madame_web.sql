ALTER TABLE `undb_outbox` ADD `user_id` text;--> statement-breakpoint
ALTER TABLE `undb_outbox` DROP COLUMN `operator_id`;