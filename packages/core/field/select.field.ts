import type { ISelectFilter, ISelectFilterOperator } from '../filter'
import { BaseField } from './field.base'
import type { ISelectField } from './field.type'
import { SelectFieldValue } from './select-field-value'
import type { ICreateSelectFieldValue } from './select-field.type'

export class SelectField extends BaseField<ISelectField> {
  get type(): 'select' {
    return 'select'
  }

  createFilter(operator: ISelectFilterOperator, value: string | null): ISelectFilter {
    return { operator, value, path: this.name.value, type: 'select' }
  }

  createValue(value: ICreateSelectFieldValue): SelectFieldValue {
    return new SelectFieldValue(value)
  }
}
