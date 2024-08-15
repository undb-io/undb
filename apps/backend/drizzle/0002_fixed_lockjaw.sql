DROP INDEX IF EXISTS `undb_invitation_email_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `invitation_unique_idx` ON `undb_invitation` (`email`,`space_id`);