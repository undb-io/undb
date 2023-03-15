import { Migration } from '@mikro-orm/migrations'

export class Migration20230315031115 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `ego_field` add column `description` text null;')
  }
}
