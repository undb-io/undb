import { isEmpty } from 'lodash-es'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/interface.js'
import type { Table } from '../../table.js'
import type { Sorts } from '../sort/index.js'
import type { ViewVO } from '../view.vo.js'
import { BaseViewSpecification } from './base-view-specification.js'

export class WithSorts extends BaseViewSpecification {
  constructor(public readonly sorts: Sorts | null, public readonly view: ViewVO) {
    super(view)
  }

  isSatisfiedBy(t: Table): boolean {
    if (!this.sorts) {
      return isEmpty(t.mustGetView(this.view.id.value).filter)
    }

    return t.mustGetView(this.view.id.value).sorts?.equals(this.sorts) ?? false
  }

  mutate(t: Table): Result<Table, string> {
    const view = t.mustGetView(this.view.id.value)
    view.sorts = this.sorts ?? undefined
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.sortsEqual(this)
    return Ok(undefined)
  }
}
