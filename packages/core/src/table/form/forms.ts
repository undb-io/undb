import { ValueObject } from '@undb/domain'
import { Option } from 'oxide.ts'
import { FormId } from './form-id.vo.js'
import type { ICreateFormsSchema } from './form.schema.js'
import { Form } from './form.vo.js'

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
}
