import { ValueObject } from '@undb/domain'
import { FormFields } from './form-fields.vo.js'
import { FormId } from './form-id.vo.js'
import { FormName } from './form-name.vo.js'
import type { ICreateFormSchema } from './form.schema.js'
import type { IForm } from './form.type.js'

export class Form extends ValueObject<IForm> {
  public get id() {
    return this.props.id
  }

  public get name() {
    return this.props.name
  }

  public get fields() {
    return this.props.fields
  }

  public set fields(fields: FormFields) {
    this.props.fields = fields
  }

  public static create(input: ICreateFormSchema): Form {
    return new this({
      id: FormId.fromNullableString(input.id),
      name: FormName.create(input.name),
      fields: FormFields.from(input.fields),
    })
  }
}
