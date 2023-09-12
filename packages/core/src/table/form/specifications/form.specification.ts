import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { TableSchema } from '../../value-objects/index.js'
import type { ICreateFormsSchema } from '../form.schema.js'
import type { Form } from '../form.vo.js'
import { Forms } from '../forms.js'

export class WithTableForms extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly forms: Forms) {
    super()
  }

  static from(input: ICreateFormsSchema, schema: TableSchema): WithTableForms {
    const forms = Forms.create(input, schema)
    return new this(forms)
  }

  static unsafeFrom(input: ICreateFormsSchema): WithTableForms {
    const forms = Forms.unsafeCreate(input)
    return new this(forms)
  }

  isSatisfiedBy(t: Table): boolean {
    return this.forms.equals(t.forms)
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

export class WithNewForm extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly form: Form) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }

  mutate(t: Table): Result<Table, string> {
    t.forms.addForm(this.form)
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.newForm(this)
    return Ok(undefined)
  }
}

export class WithoutForm extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly form: Form) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }

  mutate(t: Table): Result<Table, string> {
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withoutForm(this)
    return Ok(undefined)
  }
}
