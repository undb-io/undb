import { Migration } from '@mikro-orm/migrations'

export class Migration20230109035737 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `table` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null, primary key (`id`));',
    )

    this.addSql(
      "create table `field` (`id` text not null, `table_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null, `type` text check (`type` in ('string', 'number', 'bool', 'date', 'date-range', 'select')) not null, constraint `field_table_id_foreign` foreign key(`table_id`) references `table`(`id`) on update cascade, primary key (`id`, `table_id`));",
    )
    this.addSql('create index `field_table_id_index` on `field` (`table_id`);')
    this.addSql('create index `field_type_index` on `field` (`type`);')

    this.addSql(
      'create table `option` (`id` text not null, `field_id` text not null, `field_table_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `name` text not null, `color_name` integer not null, `color_shade` integer not null, constraint `option_field_id_field_table_id_foreign` foreign key(`field_id`, `field_table_id`) references `field`(`id`, `table_id`) on update cascade, primary key (`id`, `field_id`, `field_table_id`));',
    )
    this.addSql('create index `option_field_id_field_table_id_index` on `option` (`field_id`, `field_table_id`);')
  }
}
