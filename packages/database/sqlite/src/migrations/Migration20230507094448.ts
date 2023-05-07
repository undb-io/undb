import { Migration } from '@mikro-orm/migrations'

export class Migration20230507094448 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `undb_table` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text not null, `emoji` text not null, `views_order` text null, primary key (`id`));',
    )
    this.addSql('create index `undb_table_deleted_at_index` on `undb_table` (`deleted_at`);')

    this.addSql(
      'create table `undb_field` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text null, `name` text not null, `description` text null, `system` integer not null default false, `required` integer not null default false, `display` integer not null default false, `type` text not null, `format` text null, `foreign_table_id` text null, `symmetric_reference_field_id` text null, `is_owner` integer null default false, `parent_field_id` text null, `tree_field_id` text null, `max` integer null, `count_reference_field_id` text null, `lookup_reference_field_id` text null, `sum_reference_field_id` text null, `sum_aggregate_field_id` text null, `average_reference_field_id` text null, `average_aggregate_field_id` text null, constraint `undb_field_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on delete cascade on update cascade, constraint `undb_field_foreign_table_id_foreign` foreign key(`foreign_table_id`) references `undb_table`(`id`) on delete set null on update cascade, constraint `undb_field_symmetric_reference_field_id_foreign` foreign key(`symmetric_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_count_reference_field_id_foreign` foreign key(`count_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_lookup_reference_field_id_foreign` foreign key(`lookup_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_sum_reference_field_id_foreign` foreign key(`sum_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_sum_aggregate_field_id_foreign` foreign key(`sum_aggregate_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_average_reference_field_id_foreign` foreign key(`average_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_average_aggregate_field_id_foreign` foreign key(`average_aggregate_field_id`) references `undb_field`(`id`) on delete set null on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_field_deleted_at_index` on `undb_field` (`deleted_at`);')
    this.addSql('create index `undb_field_table_id_index` on `undb_field` (`table_id`);')
    this.addSql('create index `undb_field_type_index` on `undb_field` (`type`);')
    this.addSql('create index `undb_field_foreign_table_id_index` on `undb_field` (`foreign_table_id`);')
    this.addSql(
      'create unique index `undb_field_symmetric_reference_field_id_unique` on `undb_field` (`symmetric_reference_field_id`);',
    )
    this.addSql(
      'create index `undb_field_count_reference_field_id_index` on `undb_field` (`count_reference_field_id`);',
    )
    this.addSql(
      'create index `undb_field_lookup_reference_field_id_index` on `undb_field` (`lookup_reference_field_id`);',
    )
    this.addSql('create index `undb_field_sum_reference_field_id_index` on `undb_field` (`sum_reference_field_id`);')
    this.addSql('create index `undb_field_sum_aggregate_field_id_index` on `undb_field` (`sum_aggregate_field_id`);')
    this.addSql(
      'create index `undb_field_average_reference_field_id_index` on `undb_field` (`average_reference_field_id`);',
    )
    this.addSql(
      'create index `undb_field_average_aggregate_field_id_index` on `undb_field` (`average_aggregate_field_id`);',
    )

    this.addSql(
      'create table `undb_option` (`key` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `field_id` text null, `name` text not null, `color_name` text not null, `color_shade` integer not null, constraint `undb_option_field_id_foreign` foreign key(`field_id`) references `undb_field`(`id`) on delete cascade on update cascade, primary key (`key`));',
    )
    this.addSql('create index `undb_option_deleted_at_index` on `undb_option` (`deleted_at`);')
    this.addSql('create index `undb_option_field_id_index` on `undb_option` (`field_id`);')

    this.addSql(
      'create table `undb_attachment` (`id` text not null, `record_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text not null, `mime_type` text not null, `name` text not null, `size` integer not null, `token` text not null, `url` text not null, `extension` text not null, constraint `undb_attachment_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on update cascade, primary key (`id`, `record_id`));',
    )
    this.addSql('create index `undb_attachment_deleted_at_index` on `undb_attachment` (`deleted_at`);')
    this.addSql('create index `undb_attachment_table_id_index` on `undb_attachment` (`table_id`);')
    this.addSql('create index `undb_attachment_mime_type_index` on `undb_attachment` (`mime_type`);')
    this.addSql('create index `undb_attachment_name_index` on `undb_attachment` (`name`);')
    this.addSql('create index `undb_attachment_size_index` on `undb_attachment` (`size`);')
    this.addSql('create index `undb_attachment_extension_index` on `undb_attachment` (`extension`);')

    this.addSql(
      'create table `undb_field_display_fields` (`field_1_id` text not null, `field_2_id` text not null, constraint `undb_field_display_fields_field_1_id_foreign` foreign key(`field_1_id`) references `undb_field`(`id`) on delete cascade on update cascade, constraint `undb_field_display_fields_field_2_id_foreign` foreign key(`field_2_id`) references `undb_field`(`id`) on delete cascade on update cascade, primary key (`field_1_id`, `field_2_id`));',
    )
    this.addSql(
      'create index `undb_field_display_fields_field_1_id_index` on `undb_field_display_fields` (`field_1_id`);',
    )
    this.addSql(
      'create index `undb_field_display_fields_field_2_id_index` on `undb_field_display_fields` (`field_2_id`);',
    )

    this.addSql(
      'create table `undb_user` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `avatar` text null, `username` text not null, `email` text not null, `password` text not null, primary key (`id`));',
    )
    this.addSql('create index `undb_user_deleted_at_index` on `undb_user` (`deleted_at`);')
    this.addSql('create index `undb_user_username_index` on `undb_user` (`username`);')
    this.addSql('create index `undb_user_email_index` on `undb_user` (`email`);')
    this.addSql('create unique index `undb_user_email_unique` on `undb_user` (`email`);')

    this.addSql(
      "create table `undb_view` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text null, `name` text not null, `show_system_fields` integer not null default false, `display_type` text check (`display_type` in ('kanban', 'calendar', 'grid', 'tree')) not null, `sorts` json null, `kanban_field_id` text null, `calendar_field_id` text null, `tree_field_id` text null, `filter` json null, `field_options` json null, `fields_order` text null, `pinned_fields` json null, `row_height` text check (`row_height` in ('short', 'medium', 'tall')) null, constraint `undb_view_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on delete cascade on update cascade, primary key (`id`));",
    )
    this.addSql('create index `undb_view_deleted_at_index` on `undb_view` (`deleted_at`);')
    this.addSql('create index `undb_view_table_id_index` on `undb_view` (`table_id`);')
  }
}
