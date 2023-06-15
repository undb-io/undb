import { Migration } from '@mikro-orm/migrations'

export class Migration20230615120025 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `undb_webhook` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `url` text not null, `name` text not null, `method` text not null, `headers` json not null, `target_id` text null, `target_type` text null, `event` text null, `enabled` integer not null default false, primary key (`id`));',
    )
    this.addSql('create index `undb_webhook_deleted_at_index` on `undb_webhook` (`deleted_at`);')
    this.addSql('create index `undb_webhook_url_index` on `undb_webhook` (`url`);')
    this.addSql('create index `undb_webhook_name_index` on `undb_webhook` (`name`);')
    this.addSql('create index `undb_webhook_method_index` on `undb_webhook` (`method`);')
    this.addSql('create index `undb_webhook_target_id_index` on `undb_webhook` (`target_id`);')
    this.addSql('create index `undb_webhook_event_index` on `undb_webhook` (`event`);')
  }
}
