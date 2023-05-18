import { Migration } from '@mikro-orm/migrations'

export class Migration20230518040812 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `undb_field` add column `time_format` text null;')
  }
}
