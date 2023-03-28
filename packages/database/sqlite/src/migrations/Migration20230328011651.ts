import { Migration } from '@mikro-orm/migrations'

export class Migration20230328011651 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `ego_field` add column `display` integer not null default false;')
  }
}
