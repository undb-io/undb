import { ValueObject } from '@undb/domain'
import { Form } from './form.vo.js'
import type { ICreateFormsSchema } from './forms.schema.js'

export class Forms extends ValueObject<Form[]> {
  public forms() {
    return this.props
  }

  static create(input: ICreateFormsSchema): Forms {
    return new this(input.map((i) => Form.create(i)))
  }
}
