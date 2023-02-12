import { isEmpty } from '@fxts/core'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IRootFilter } from '../../filter/index.js'
import { RootFilter } from '../../filter/index.js'
import type { ITableSpecVisitor } from '../../specifications/interface.js'
import type { Table } from '../../table.js'
import type { View } from '../view.js'
import { BaseViewSpecification } from './base-view-specification.js'

export class WithFilter extends BaseViewSpecification {
  constructor(public readonly filter: IRootFilter | null, public readonly view: View) {
    super(view)
  }

  isSatisfiedBy(t: Table): boolean {
    if (!this.filter) {
      return isEmpty(t.mustGetView(this.view.key.value).filter)
    }
    return t.mustGetView(this.view.key.value).filter?.equals(new RootFilter(this.filter)) ?? false
  }

  mutate(t: Table): Result<Table, string> {
    const view = t.mustGetView(this.view.key.value)
    view.setFilter(this.filter)
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.filterEqual(this)
    return Ok(undefined)
  }
}
