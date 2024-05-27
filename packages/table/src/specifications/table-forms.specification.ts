import { Ok, WontImplementException, type Result } from "@undb/domain"
import { FormsVO } from "../modules/forms/forms.vo"
import type { TableDo } from "../table.do"
import type { ITableSpecVisitor } from "./table-visitor.interface"
import { TableComositeSpecification } from "./table.composite-specification"
import type { FormVO, IFormDTO } from "../modules"

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
