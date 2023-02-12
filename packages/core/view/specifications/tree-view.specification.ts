import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FieldId } from '../../field/index.js'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { View } from '../view.js'
import { BaseViewSpecification } from './base-view-specification.js'

export class WithTreeViewField extends BaseViewSpecification {
  constructor(public readonly view: View, public readonly fieldId: FieldId | null) {
    super(view)
  }

  isSatisfiedBy(): boolean {
    return this.view.treeViewFieldId.mapOr(false, (fieldId) => !!this.fieldId && fieldId.equals(this.fieldId))
  }

  mutate(t: Table): Result<Table, string> {
    this.view.getOrCreateTreeView().fieldId = this.fieldId ?? undefined
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.treeViewFieldEqual(this)
    return Ok(undefined)
  }
}
