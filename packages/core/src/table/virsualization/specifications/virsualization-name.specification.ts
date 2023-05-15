import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { VirsualizationName } from '../virsualization-name.vo.js'

export class WithVirsualizationNameSpec extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly virsualizationId: string, public readonly name: VirsualizationName) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withVirsualizationName(this)
    return Ok(undefined)
  }
}
