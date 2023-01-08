import { Migration } from '@mikro-orm/migrations'

export class Init extends Migration {
  async up(): Promise<void> {
    this.addSql(`
    CREATE TABLE tables(
      id TEXT PRIMARY KEY     NOT NULL,
      name TEXT    NOT NULL
   );
    `)
  }
}
