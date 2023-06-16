import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import { FieldId } from '../../field/index.js'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { INumberAggregateFunction } from '../number.visualization.js'
import { VisualizationID } from '../visualization-id.vo.js'

export class WithNumberAggregateSpec extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly visualizationId: VisualizationID,
    public readonly fieldId?: FieldId,
    public readonly aggregateFunction?: INumberAggregateFunction,
  ) {
    super()
  }

  static from(visualizationId: string, fieldId?: string, aggregateFunction?: INumberAggregateFunction) {
    return new this(
      VisualizationID.from(visualizationId).unwrap(),
      fieldId ? FieldId.fromString(fieldId) : undefined,
      aggregateFunction,
    )
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withNumberAggregate(this)
    return Ok(undefined)
  }
}
