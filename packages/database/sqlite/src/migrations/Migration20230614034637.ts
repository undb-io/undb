import { Migration } from '@mikro-orm/migrations'

export class Migration20230614034637 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `undb_webhook` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `url` text not null, `method` text not null, `target_id` text null, `target_type` text null, `events` text null, `enabled` integer not null default false, primary key (`id`));',
    )
    this.addSql('create index `undb_webhook_deleted_at_index` on `undb_webhook` (`deleted_at`);')
  }
}
