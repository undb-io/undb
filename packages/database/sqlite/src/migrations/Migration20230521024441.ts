import { Migration } from '@mikro-orm/migrations'

export class Migration20230521024441 extends Migration {
  async up(): Promise<void> {
    this.addSql("alter table `undb_user` add column `color` text not null default 'blue';")
  }
}
