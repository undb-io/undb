import { Migration } from '@mikro-orm/migrations'

export class Migration20230123085333 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `table` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text not null, primary key (`id`));',
    )
    this.addSql('create index `table_deleted_at_index` on `table` (`deleted_at`);')

    this.addSql(
      "create table `field` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `key` text not null, `table_id` text null, `name` text not null, `system` text not null default false, `type` text check (`type` in ('id', 'created-at', 'updated-at', 'auto-increment', 'string', 'number', 'date', 'select', 'bool', 'date-range', 'reference', 'tree')) not null, constraint `field_table_id_foreign` foreign key(`table_id`) references `table`(`id`) on delete cascade on update cascade, primary key (`id`));",
    )
    this.addSql('create index `field_deleted_at_index` on `field` (`deleted_at`);')
    this.addSql('create index `field_table_id_index` on `field` (`table_id`);')
    this.addSql('create index `field_type_index` on `field` (`type`);')

    this.addSql(
      "create table `option` (`key` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `field_id` text null, `name` text not null, `color_name` text check (`color_name` in ('dark', 'gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange')) not null, `color_shade` integer not null, constraint `option_field_id_foreign` foreign key(`field_id`) references `field`(`id`) on delete cascade on update cascade, primary key (`key`));",
    )
    this.addSql('create index `option_deleted_at_index` on `option` (`deleted_at`);')
    this.addSql('create index `option_field_id_index` on `option` (`field_id`);')

    this.addSql(
      "create table `view` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `key` text not null, `table_id` text null, `name` text not null, `display_type` text check (`display_type` in ('kanban', 'calendar', 'grid')) not null, `sorts` json null, `kanban_field_id` text null, `calendar_field_id` text null, `filter` json null, `field_options` json null, `fields_order` text null, constraint `view_table_id_foreign` foreign key(`table_id`) references `table`(`id`) on delete cascade on update cascade, primary key (`id`));",
    )
    this.addSql('create index `view_deleted_at_index` on `view` (`deleted_at`);')
    this.addSql('create index `view_table_id_index` on `view` (`table_id`);')
  }
}
