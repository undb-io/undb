import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../../specifications/index.js'
import type { Table } from '../../../table.js'
import type { ViewVO } from '../../view.vo.js'
import type { Dashboard } from '../dashboard.vo.js'
import type { Widge } from '../widge.vo.js'

export class WithWidgeSepecification extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly view: ViewVO, public readonly dashboard: Dashboard, public readonly widge: Widge) {
    super()
  }
  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    this.dashboard.widges.push(this.widge)
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withWidge(this)
    return Ok(undefined)
  }
}
