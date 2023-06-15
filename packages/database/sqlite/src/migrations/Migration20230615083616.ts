import { Migration } from '@mikro-orm/migrations'

export class Migration20230615083616 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `undb_webhook` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `url` text not null, `name` text not null, `method` text not null, `headers` json not null, `target_id` text null, `target_type` text null, `event` text null, `enabled` integer not null default false, primary key (`id`));',
    )
    this.addSql('create index `undb_webhook_deleted_at_index` on `undb_webhook` (`deleted_at`);')
    this.addSql(
      'create unique index `undb_webhook_url_event_target_id_method_unique` on `undb_webhook` (`url`, `event`, `target_id`, `method`);',
    )
  }
}
