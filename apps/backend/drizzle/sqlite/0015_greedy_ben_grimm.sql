PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_undb_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`spaceId` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `undb_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`spaceId`) REFERENCES `undb_space`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_undb_session`("id", "user_id", "expires_at", "spaceId") SELECT "id", "user_id", "expires_at", "spaceId" FROM `undb_session`;--> statement-breakpoint
DROP TABLE `undb_session`;--> statement-breakpoint
ALTER TABLE `__new_undb_session` RENAME TO `undb_session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;