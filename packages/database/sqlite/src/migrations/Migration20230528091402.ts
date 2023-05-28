import { Migration } from '@mikro-orm/migrations'

export class Migration20230528091402 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `undb_attachment` add column `field_id` text not null;')
  }
}
