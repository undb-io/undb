import { ValueObject } from '@undb/domain'
import type { ICreateFormsSchema } from './form.schema.js'
import { Form } from './form.vo.js'

export class Forms extends ValueObject<Form[]> {
  public forms() {
    return this.props
  }

  static create(input: ICreateFormsSchema): Forms {
    return new this(input.map((i) => Form.create(i)))
  }
}
