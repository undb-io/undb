import type { TableCompositeSpecification } from '../specifications/index.js'
import type { Table } from '../table.js'
import type { ITableRepository } from '../table.repository.js'
import { ForeignTableReferenceHandler } from './foreign-table-reference.handler.js'

export interface ITableSpecHandler {
  handle(table: Table, spec: TableCompositeSpecification): Promise<void>
}

export class TableSpecHandler implements ITableSpecHandler {
  constructor(private readonly tableRepo: ITableRepository) {}

  async #handleReference(table: Table, spec: TableCompositeSpecification) {
    for (const foreignTableId of table.foreignTableIds) {
      const foreignTable = (await this.tableRepo.findOneById(foreignTableId)).unwrap()
      const visitor = new ForeignTableReferenceHandler(table, foreignTable)

      spec.accept(visitor)

      const foreignSpec = visitor.spec.into()
      if (foreignSpec) {
        foreignSpec.mutate(foreignTable)
        await this.tableRepo.updateOneById(foreignTable.id.value, foreignSpec)
      }
    }
  }

  async handle(table: Table, spec: TableCompositeSpecification): Promise<void> {
    await this.#handleReference(table, spec)
  }
}
