PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_undb_reference_id_mapping` (
	`field_id` text NOT NULL,
	`table_id` text NOT NULL,
	`symmetric_field_id` text,
	`foreign_table_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_undb_reference_id_mapping`("field_id", "table_id", "symmetric_field_id", "foreign_table_id") SELECT "field_id", "table_id", "symmetric_field_id", "foreign_table_id" FROM `undb_reference_id_mapping`;--> statement-breakpoint
DROP TABLE `undb_reference_id_mapping`;--> statement-breakpoint
ALTER TABLE `__new_undb_reference_id_mapping` RENAME TO `undb_reference_id_mapping`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `reference_id_mapping_unique_idx` ON `undb_reference_id_mapping` (`field_id`,`table_id`,`symmetric_field_id`,`foreign_table_id`);--> statement-breakpoint
CREATE TABLE `__new_undb_rollup_id_mapping` (
	`field_id` text NOT NULL,
	`table_id` text NOT NULL,
	`rollup_id` text NOT NULL,
	`rollup_table_id` text NOT NULL,
	PRIMARY KEY(`field_id`, `rollup_id`)
);
--> statement-breakpoint
INSERT INTO `__new_undb_rollup_id_mapping`("field_id", "table_id", "rollup_id", "rollup_table_id") SELECT "field_id", "table_id", "rollup_id", "rollup_table_id" FROM `undb_rollup_id_mapping`;--> statement-breakpoint
DROP TABLE `undb_rollup_id_mapping`;--> statement-breakpoint
ALTER TABLE `__new_undb_rollup_id_mapping` RENAME TO `undb_rollup_id_mapping`;