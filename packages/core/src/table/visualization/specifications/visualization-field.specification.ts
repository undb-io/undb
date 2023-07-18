import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { FieldId } from '../../field/index.js'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'

export class WithVisualizationFieldSpec extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly visualizationId: string, public readonly fieldId: FieldId | null) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withVisualizationField(this)
    return Ok(undefined)
  }
}
