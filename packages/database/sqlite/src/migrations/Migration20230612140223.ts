import { Migration } from '@mikro-orm/migrations'

export class Migration20230612140223 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `undb_outbox` (`uuid` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text null, `operator_id` text null, `payload` json not null, primary key (`uuid`));',
    )
    this.addSql('create index `undb_outbox_deleted_at_index` on `undb_outbox` (`deleted_at`);')

    this.addSql('create index `undb_option_name_index` on `undb_option` (`name`);')
  }
}
