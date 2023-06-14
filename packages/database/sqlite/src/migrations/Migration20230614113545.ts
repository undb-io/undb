import { Migration } from '@mikro-orm/migrations'

export class Migration20230614113545 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `undb_visualization` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text not null, `type` text not null, `table_id` text null, `number_aggregate_function` text null, `field_id` text null, `chart_aggregate_function` text null, `chart_type` text null, constraint `undb_visualization_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on delete cascade on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_visualization_deleted_at_index` on `undb_visualization` (`deleted_at`);')
    this.addSql('create index `undb_visualization_type_index` on `undb_visualization` (`type`);')
    this.addSql('create index `undb_visualization_table_id_index` on `undb_visualization` (`table_id`);')

    this.addSql('drop table if exists `undb_virsualization`;')

    this.addSql('drop index `undb_widge_virsualization_id_unique`;')
    this.addSql('alter table `undb_widge` rename column `virsualization_id` to `visualization_id`;')
    this.addSql('create unique index `undb_widge_visualization_id_unique` on `undb_widge` (`visualization_id`);')
  }
}
