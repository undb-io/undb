import { Ok, WontImplementException, type Result } from "@undb/domain"
import type { FormVO, IFormDTO } from "../modules"
import { FormsVO } from "../modules/forms/forms.vo"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"

export class TableFormsSpecification extends TableComositeSpecification {
  constructor(public readonly forms: FormsVO) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(TableFormsSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.forms = this.forms
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withForms(this)
    return Ok(undefined)
  }
}

export class WithFormIdSpecification extends TableComositeSpecification {
  constructor(public readonly formId: string) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithNewFormSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    throw new WontImplementException(WithFormIdSpecification.name + ".mutate")
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFormId(this)
    return Ok(undefined)
  }
}

export class WithNewFormSpecification extends TableComositeSpecification {
  constructor(public readonly form: FormVO) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithNewFormSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    const forms = t.forms?.props ?? []
    t.forms = new FormsVO([...forms, this.form])
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withNewForm(this)
    return Ok(undefined)
  }
}

export class WithoutFormSpecification extends TableComositeSpecification {
  constructor(public readonly formId: string) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithoutFormSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    t.forms = t.forms ? new FormsVO(t.forms?.props.filter((f) => f.id !== this.formId)) : undefined
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withoutForm(this)
    return Ok(undefined)
  }
}

export class WithFormSpecification extends TableComositeSpecification {
  constructor(
    public readonly previous: IFormDTO | undefined,
    public readonly form: FormVO,
  ) {
    super()
  }
  isSatisfiedBy(t: TableDo): boolean {
    throw new WontImplementException(WithNewFormSpecification.name + ".isSatisfiedBy")
  }
  mutate(t: TableDo): Result<TableDo, string> {
    const forms = t.forms?.props ?? []
    t.forms = new FormsVO(forms.map((f) => (f.id === this.form.id ? this.form : f)))
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withForm(this)
    return Ok(undefined)
  }
}
