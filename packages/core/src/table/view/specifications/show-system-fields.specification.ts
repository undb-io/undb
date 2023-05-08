import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { ViewVO } from '../view.vo.js'
import { BaseViewSpecification } from './base-view-specification.js'

export class WithShowSystemFieldsSpec extends BaseViewSpecification {
  constructor(view: ViewVO, public readonly showSystemFields = false) {
    super(view)
  }
  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }

  mutate(t: Table): Result<Table, string> {
    this.view.showSystemFields = this.showSystemFields
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withShowSystemFields(this)
    return Ok(undefined)
  }
}
