/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ParentField, ReferenceField, TreeField } from '../field/index.js'
import type { Table } from '../table.js'
import { AbstractReferenceFieldSpecVisitor } from './abstract-reference-field-spec.visitor.js'

export class ForeignTableCollector extends AbstractReferenceFieldSpecVisitor {
  constructor(private readonly table: Table) {
    super()
  }

  #foreignTableIds = new Set<string>()

  public get foreignTableIds(): ReadonlySet<string> {
    return this.#foreignTableIds
  }

  reference(field: ReferenceField): void {
    const foreignTableId = field.foreignTableId.unwrap()
    if (field.isOwner && foreignTableId !== this.table.id.value) {
      this.#foreignTableIds.add(foreignTableId)
    }
  }
  tree(field: TreeField): void {}
  parent(field: ParentField): void {}
}
