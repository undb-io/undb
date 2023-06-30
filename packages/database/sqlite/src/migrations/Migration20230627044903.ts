import { Migration } from '@mikro-orm/migrations'

export class Migration20230627044903 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `undb_share` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `target_id` text null, `target_type` text null, `enabled` integer not null default false, primary key (`id`));',
    )
    this.addSql('create index `undb_share_deleted_at_index` on `undb_share` (`deleted_at`);')
    this.addSql('create index `undb_share_target_id_index` on `undb_share` (`target_id`);')
    this.addSql('create unique index `undb_share_target_id_unique` on `undb_share` (`target_id`);')
  }
}
