import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FormId } from '../form/form-id.vo.js'
import type { Table } from '../table.js'
import { TableId } from '../value-objects/index.js'
import type { ViewId } from '../view/view-id.vo.js'
import type { ITableSpecVisitor } from './interface.js'

export class WithTableViewId extends CompositeSpecification {
  constructor(public readonly viewId: ViewId) {
    super()
  }

  static fromString(id: string): WithTableViewId {
    return new WithTableViewId(TableId.fromOrCreate(id))
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('not implemented')
  }

  mutate(t: Table): Result<Table, string> {
    throw new Error('not implemented')
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.viewIdEqual(this)
    return Ok(undefined)
  }
}

export class WithTableFormId extends CompositeSpecification {
  constructor(public readonly formId: FormId) {
    super()
  }

  static fromString(id: string): WithTableFormId {
    return new WithTableFormId(TableId.fromOrCreate(id))
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('not implemented')
  }

  mutate(t: Table): Result<Table, string> {
    throw new Error('not implemented')
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.formIdEqual(this)
    return Ok(undefined)
  }
}
