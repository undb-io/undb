import { Migration } from '@mikro-orm/migrations'

export class Migration20230508095604 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `undb_view` add column `dashboard_widges` json null;')
  }
}
