import { ValueObject } from '@undb/domain'
import type { Schema } from '../schema'
import type { IFilterGroup } from './filter.type'
import { getSpec } from './filter.util'

export class Filter extends ValueObject<IFilterGroup> {
  constructor(value: IFilterGroup) {
    super(value)
  }

  getSpec(schema: Schema) {
    const fieldMap = schema.fieldMapById

    return getSpec(fieldMap, this.value)
  }
}
