import { Migration } from '@mikro-orm/migrations'

export class Migration20230315041338 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `ego_field` add column `required` text not null default false;')
  }
}
