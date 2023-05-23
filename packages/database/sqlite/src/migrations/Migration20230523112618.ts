import { Migration } from '@mikro-orm/migrations'

export class Migration20230523112618 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `undb_field` add column `symbol` text null;')
  }
}
