import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { VisualizationName } from '../visualization-name.vo.js'

export class WithVisualizationNameSpec extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly visualizationId: string, public readonly name: VisualizationName) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withVisualizationName(this)
    return Ok(undefined)
  }
}
