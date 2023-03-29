import { Migration } from '@mikro-orm/migrations'

export class Migration20230329032510 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `ego_table` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text not null, `views_order` text null, primary key (`id`));',
    )
    this.addSql('create index `ego_table_deleted_at_index` on `ego_table` (`deleted_at`);')

    this.addSql(
      "create table `ego_field` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text null, `name` text not null, `description` text null, `system` integer not null default false, `required` integer not null default false, `display` integer not null default false, `type` text check (`type` in ('id', 'created-at', 'updated-at', 'auto-increment', 'string', 'email', 'color', 'number', 'percentage', 'date', 'select', 'bool', 'date-range', 'reference', 'tree', 'parent', 'rating', 'count', 'lookup', 'sum', 'average', 'attachment')) not null, `format` text null, `foreign_table_id` text null, `symmetric_reference_field_id` text null, `is_owner` integer null default false, `parent_field_id` text null, `tree_field_id` text null, `max` integer null, `count_reference_field_id` text null, `lookup_reference_field_id` text null, `sum_reference_field_id` text null, `sum_aggregate_field_id` text null, `average_reference_field_id` text null, `average_aggregate_field_id` text null, constraint `ego_field_table_id_foreign` foreign key(`table_id`) references `ego_table`(`id`) on delete cascade on update cascade, constraint `ego_field_foreign_table_id_foreign` foreign key(`foreign_table_id`) references `ego_table`(`id`) on delete set null on update cascade, constraint `ego_field_symmetric_reference_field_id_foreign` foreign key(`symmetric_reference_field_id`) references `ego_field`(`id`) on delete set null on update cascade, constraint `ego_field_count_reference_field_id_foreign` foreign key(`count_reference_field_id`) references `ego_field`(`id`) on delete set null on update cascade, constraint `ego_field_lookup_reference_field_id_foreign` foreign key(`lookup_reference_field_id`) references `ego_field`(`id`) on delete set null on update cascade, constraint `ego_field_sum_reference_field_id_foreign` foreign key(`sum_reference_field_id`) references `ego_field`(`id`) on delete set null on update cascade, constraint `ego_field_sum_aggregate_field_id_foreign` foreign key(`sum_aggregate_field_id`) references `ego_field`(`id`) on delete set null on update cascade, constraint `ego_field_average_reference_field_id_foreign` foreign key(`average_reference_field_id`) references `ego_field`(`id`) on delete set null on update cascade, constraint `ego_field_average_aggregate_field_id_foreign` foreign key(`average_aggregate_field_id`) references `ego_field`(`id`) on delete set null on update cascade, primary key (`id`));",
    )
    this.addSql('create index `ego_field_deleted_at_index` on `ego_field` (`deleted_at`);')
    this.addSql('create index `ego_field_table_id_index` on `ego_field` (`table_id`);')
    this.addSql('create index `ego_field_type_index` on `ego_field` (`type`);')
    this.addSql('create index `ego_field_foreign_table_id_index` on `ego_field` (`foreign_table_id`);')
    this.addSql(
      'create unique index `ego_field_symmetric_reference_field_id_unique` on `ego_field` (`symmetric_reference_field_id`);',
    )
    this.addSql('create index `ego_field_count_reference_field_id_index` on `ego_field` (`count_reference_field_id`);')
    this.addSql(
      'create index `ego_field_lookup_reference_field_id_index` on `ego_field` (`lookup_reference_field_id`);',
    )
    this.addSql('create index `ego_field_sum_reference_field_id_index` on `ego_field` (`sum_reference_field_id`);')
    this.addSql('create index `ego_field_sum_aggregate_field_id_index` on `ego_field` (`sum_aggregate_field_id`);')
    this.addSql(
      'create index `ego_field_average_reference_field_id_index` on `ego_field` (`average_reference_field_id`);',
    )
    this.addSql(
      'create index `ego_field_average_aggregate_field_id_index` on `ego_field` (`average_aggregate_field_id`);',
    )

    this.addSql(
      "create table `ego_option` (`key` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `field_id` text null, `name` text not null, `color_name` text check (`color_name` in ('dark', 'gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange')) not null, `color_shade` integer not null, constraint `ego_option_field_id_foreign` foreign key(`field_id`) references `ego_field`(`id`) on delete cascade on update cascade, primary key (`key`));",
    )
    this.addSql('create index `ego_option_deleted_at_index` on `ego_option` (`deleted_at`);')
    this.addSql('create index `ego_option_field_id_index` on `ego_option` (`field_id`);')

    this.addSql(
      'create table `ego_field_display_fields` (`field_1_id` text not null, `field_2_id` text not null, constraint `ego_field_display_fields_field_1_id_foreign` foreign key(`field_1_id`) references `ego_field`(`id`) on delete cascade on update cascade, constraint `ego_field_display_fields_field_2_id_foreign` foreign key(`field_2_id`) references `ego_field`(`id`) on delete cascade on update cascade, primary key (`field_1_id`, `field_2_id`));',
    )
    this.addSql(
      'create index `ego_field_display_fields_field_1_id_index` on `ego_field_display_fields` (`field_1_id`);',
    )
    this.addSql(
      'create index `ego_field_display_fields_field_2_id_index` on `ego_field_display_fields` (`field_2_id`);',
    )

    this.addSql(
      "create table `ego_view` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text null, `name` text not null, `show_system_fields` integer not null default false, `display_type` text check (`display_type` in ('kanban', 'calendar', 'grid', 'tree')) not null, `sorts` json null, `kanban_field_id` text null, `calendar_field_id` text null, `tree_field_id` text null, `filter` json null, `field_options` json null, `fields_order` text null, `pinned_fields` json null, constraint `ego_view_table_id_foreign` foreign key(`table_id`) references `ego_table`(`id`) on delete cascade on update cascade, primary key (`id`));",
    )
    this.addSql('create index `ego_view_deleted_at_index` on `ego_view` (`deleted_at`);')
    this.addSql('create index `ego_view_table_id_index` on `ego_view` (`table_id`);')
  }
}
