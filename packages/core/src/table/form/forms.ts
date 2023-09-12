import { ValueObject } from '@undb/domain'
import { None, Option, Some } from 'oxide.ts'
import type { TableCompositeSpecification } from '../specifications/interface.js'
import type { TableSchema } from '../value-objects/index.js'
import type { ViewVO } from '../view/view.vo.js'
import { FormId } from './form-id.vo.js'
import type { ICreateFormBaseSchema, ICreateFormSchema, ICreateFormsSchema } from './form.schema.js'
import { Form } from './form.vo.js'
import { WithNewForm, WithoutForm } from './specifications/form.specification.js'

export class Forms extends ValueObject<Form[]> {
  public get forms() {
    return this.props
  }

  static create(input: ICreateFormsSchema, schema: TableSchema): Forms {
    return new this(input.map((i) => Form.create(i, schema)))
  }

  static unsafeCreate(input: ICreateFormsSchema): Forms {
    return new this(input.map((i) => Form.unsafeCreate(i)))
  }

  public getById(id: string): Option<Form> {
    const formId = FormId.fromString(id)
    return Option(this.forms.find((f) => f.id.equals(formId)))
  }

  deleteForm(formId: string): Option<TableCompositeSpecification> {
    const form = this.getById(formId)
    if (form.isNone()) return None

    return Some(new WithoutForm(form.unwrap()))
  }

  addForm(form: Form) {
    this.forms.push(form)
  }

  createForm(input: ICreateFormSchema, schema: TableSchema): WithNewForm {
    const form = Form.create(input, schema)
    return new WithNewForm(form)
  }

  createFormFromView(view: ViewVO, input: Partial<ICreateFormBaseSchema>, schema: TableSchema): WithNewForm {
    const form = Form.fromView(input, view, schema)
    return new WithNewForm(form)
  }
}
