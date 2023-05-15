import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { ViewPinnedFields } from '../view-pinned-fields.js'
import type { ViewVO } from '../view.vo.js'
import { BaseViewSpecification } from './base-view-specification.js'

export class WithViewPinnedFields extends BaseViewSpecification {
  constructor(public readonly pinnedFields: ViewPinnedFields, public readonly view: ViewVO) {
    super(view)
  }

  isSatisfiedBy(): boolean {
    return this.pinnedFields.equals(this.view.pinnedFields)
  }

  mutate(t: Table): Result<Table, string> {
    this.view.pinnedFields = this.pinnedFields
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.pinnedFields(this)
    return Ok(undefined)
  }
}
