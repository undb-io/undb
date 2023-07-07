import { ValueObject } from '@undb/domain'
import { FormId } from './form-id.vo.js'
import type { IForm } from './form.type.js'
import type { ICreateFormSchema } from './forms.schema.js'

export class Form extends ValueObject<IForm> {
  public get id() {
    return this.props.id
  }

  public static create(input: ICreateFormSchema): Form {
    return new this({ id: FormId.fromNullableString(input.id) })
  }
}
