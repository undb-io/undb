import type { Knex } from '@mikro-orm/better-sqlite'
import type { SelectFieldTypes } from '@undb/core'

export class UnderlyingTempDuplicateOptionTable {
  constructor(
    private readonly tableName: string,
    private readonly from: SelectFieldTypes,
    private readonly to: SelectFieldTypes,
    private readonly knex: Knex,
  ) {}

  public get name() {
    return `__temp_duplicate_option_${this.tableName}_${this.from.id.value}_${this.to.id.value}`
  }

  static FROM_FIELD = 'from_id'
  static TO_FIELD = 'to_id'

  public create(): string[] {
    const queries = []
    const createQuery = this.knex.schema
      .createTable(this.name, (tb) => {
        tb.string(UnderlyingTempDuplicateOptionTable.FROM_FIELD)
        tb.string(UnderlyingTempDuplicateOptionTable.TO_FIELD)
      })
      .toQuery()

    queries.push(createQuery)

    const newOptions = this.to.options.options
    const rows = this.from.options.options.map((option, index) => ({
      [UnderlyingTempDuplicateOptionTable.FROM_FIELD]: option.key.value,
      [UnderlyingTempDuplicateOptionTable.TO_FIELD]: newOptions[index].key.value,
    }))

    const insert = this.knex.insert(rows).into(this.name).toQuery()

    queries.push(insert)

    return queries
  }

  public drop(): string {
    return this.knex.schema.dropTable(this.name).toQuery()
  }
}
