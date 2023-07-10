import { ValueObject } from '@undb/domain'
import { Option } from 'oxide.ts'
import { FormId } from './form-id.vo.js'
import type { ICreateFormSchema, ICreateFormsSchema } from './form.schema.js'
import { Form } from './form.vo.js'
import { WithNewForm } from './specifications/form.specification.js'

export class Forms extends ValueObject<Form[]> {
  public get forms() {
    return this.props
  }

  static create(input: ICreateFormsSchema): Forms {
    return new this(input.map((i) => Form.create(i)))
  }

  public getById(id: string): Option<Form> {
    const formId = FormId.fromString(id)
    return Option(this.forms.find((f) => f.id.equals(formId)))
  }

  addForm(form: Form) {
    this.forms.push(form)
  }

  createForm(input: ICreateFormSchema): WithNewForm {
    const form = Form.create(input)
    return new WithNewForm(form)
  }
}
