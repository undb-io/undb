import { Migration } from '@mikro-orm/migrations'

export class Migration20230511142430 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `undb_virsualization` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text not null, `type` text not null, `table_id` text null, `number_aggregate_function` text null, `field_id` text null, `chart_aggregate_function` text null, `chart_type` text null, constraint `undb_virsualization_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on delete cascade on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_virsualization_deleted_at_index` on `undb_virsualization` (`deleted_at`);')
    this.addSql('create index `undb_virsualization_type_index` on `undb_virsualization` (`type`);')
    this.addSql('create index `undb_virsualization_table_id_index` on `undb_virsualization` (`table_id`);')

    this.addSql(
      'create table `undb_widge` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `layout` json not null, `view_id` text not null, `virsualization_id` text null, constraint `undb_widge_view_id_foreign` foreign key(`view_id`) references `undb_view`(`id`) on update cascade, constraint `undb_widge_virsualization_id_foreign` foreign key(`virsualization_id`) references `undb_virsualization`(`id`) on delete set null on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_widge_deleted_at_index` on `undb_widge` (`deleted_at`);')
    this.addSql('create index `undb_widge_view_id_index` on `undb_widge` (`view_id`);')
    this.addSql('create unique index `undb_widge_virsualization_id_unique` on `undb_widge` (`virsualization_id`);')

    this.addSql('PRAGMA foreign_keys = OFF;')
    this.addSql(
      "CREATE TABLE `_knex_temp_alter459` (`id` text NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `deleted_at` datetime NULL, `table_id` text NULL, `name` text NOT NULL, `show_system_fields` integer NOT NULL DEFAULT false, `display_type` text check (`display_type` in ('kanban', 'calendar', 'grid', 'tree', 'dashboard')) NOT NULL CHECK (`display_type` in('kanban' , 'calendar' , 'grid' , 'tree' , 'dashboard')), `sorts` json NULL, `kanban_field_id` text NULL, `calendar_field_id` text NULL, `tree_field_id` text NULL, `filter` json NULL, `field_options` json NULL, `fields_order` text NULL, `pinned_fields` json NULL, `row_height` text NULL CHECK (`row_height` in('short' , 'medium' , 'tall')), CONSTRAINT `undb_view_table_id_foreign` FOREIGN KEY (`table_id`) REFERENCES `undb_table` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY (`id`));",
    )
    this.addSql('INSERT INTO "_knex_temp_alter459" SELECT * FROM "undb_view";;')
    this.addSql('DROP TABLE "undb_view";')
    this.addSql('ALTER TABLE "_knex_temp_alter459" RENAME TO "undb_view";')
    this.addSql('CREATE INDEX `undb_view_deleted_at_index` on `undb_view` (`deleted_at`);')
    this.addSql('CREATE INDEX `undb_view_table_id_index` on `undb_view` (`table_id`);')
    this.addSql('PRAGMA foreign_keys = ON;')
  }
}
