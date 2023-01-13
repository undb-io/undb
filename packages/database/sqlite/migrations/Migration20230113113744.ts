import { Migration } from '@mikro-orm/migrations'

export class Migration20230113113744 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `table` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null, primary key (`id`));',
    )

    this.addSql(
      "create table `field` (`id` text not null, `table_id` text null, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null, `type` text check (`type` in ('string', 'number', 'bool', 'date', 'date-range', 'select')) not null, constraint `field_table_id_foreign` foreign key(`table_id`) references `table`(`id`) on delete cascade, primary key (`id`, `table_id`));",
    )
    this.addSql('create index `field_table_id_index` on `field` (`table_id`);')
    this.addSql('create index `field_type_index` on `field` (`type`);')

    this.addSql(
      'create table `option` (`id` text not null, `field_id` text null, `field_table_id` text null, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null, `color_name` integer not null, `color_shade` integer not null, constraint `option_field_id_field_table_id_foreign` foreign key(`field_id`, `field_table_id`) references `field`(`id`, `table_id`) on delete cascade on update cascade, primary key (`id`, `field_id`, `field_table_id`));',
    )
    this.addSql('create index `option_field_id_field_table_id_index` on `option` (`field_id`, `field_table_id`);')

    this.addSql(
      'create table `view` (`id` text not null, `table_id` text null, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null, `display_type` integer not null, `kanban_field_id` text null, `calendar_field_id` text null, `filter` json null, `field_options` json null, `fields_order` text null, constraint `view_table_id_foreign` foreign key(`table_id`) references `table`(`id`) on delete cascade on update cascade, primary key (`id`, `table_id`));',
    )
    this.addSql('create index `view_table_id_index` on `view` (`table_id`);')

    this.addSql(`pragma foreign_keys = on;`)
  }
}
