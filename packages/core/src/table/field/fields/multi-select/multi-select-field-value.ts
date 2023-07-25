import type { JsonValue } from 'type-fest'
import type { Option } from '../../../option/index.js'
import { FieldValueBase } from '../../field-value.base.js'
import type { IFieldValueVisitor } from '../../field-value.visitor.js'
import type { FieldValue } from '../../field.type.js'
import type { MultiSelectField } from './multi-select-field.js'
import type { IMultiSelectFieldValue } from './multi-select-field.type.js'

export class MultiSelectFieldValue extends FieldValueBase<IMultiSelectFieldValue> {
  get json(): JsonValue {
    return this.unpack()
  }

  constructor(value: IMultiSelectFieldValue) {
    super(value === null ? { value } : value)
  }

  static isMultiSelectFieldValue(value?: FieldValue): value is MultiSelectFieldValue {
    return value instanceof MultiSelectFieldValue
  }

  static fromOptions(os: Option[]): MultiSelectFieldValue {
    return new this(os.map((o) => o.key.value))
  }

  unpack(): string[] | null {
    return Array.isArray(this.props) ? this.props : null
  }

  getOptions(field: MultiSelectField): Option[] {
    const optionIds = this.unpack() ?? []
    return optionIds.map((optionId) => field.options.getById(optionId).into()).filter(Boolean) as Option[]
  }

  accept(visitor: IFieldValueVisitor): void {
    visitor.multiSelect(this)
  }
}
