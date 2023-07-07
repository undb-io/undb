import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import { Forms } from '../forms.js'
import type { ICreateFormsSchema } from '../forms.schema.js'

export class WithTableForms extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly forms: Forms) {
    super()
  }

  static from(input: ICreateFormsSchema): WithTableForms {
    const views = Forms.create(input)
    return new this(views)
  }

  isSatisfiedBy(t: Table): boolean {
    return this.forms.equals(t.views)
  }

  mutate(t: Table): Result<Table, string> {
    t.forms = this.forms
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.formsEqual(this)
    return Ok(undefined)
  }
}
