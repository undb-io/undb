CREATE TABLE `undb_dashboard_table_id_mapping` (
	`dashboard_id` text NOT NULL,
	`table_id` text NOT NULL,
	PRIMARY KEY(`dashboard_id`, `table_id`),
	FOREIGN KEY (`dashboard_id`) REFERENCES `undb_dashboard`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`table_id`) REFERENCES `undb_table`(`id`) ON UPDATE no action ON DELETE no action
);
