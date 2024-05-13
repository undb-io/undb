import { ValueObject } from '@undb/domain'
import type { Schema } from '../schema'
import type { IRootFilter } from './filter.type'
import { getSpec, isEmptyFilterGroup } from './filter.util'

export class Filter extends ValueObject<IRootFilter> {
  constructor(value: IRootFilter) {
    super(value)
  }

  get isEmpty(): boolean {
    return isEmptyFilterGroup(this.value)
  }

  getSpec(schema: Schema) {
    const fieldMap = schema.fieldMapById

    return getSpec(fieldMap, this.value)
  }

  toJSON() {
    return this.value
  }
}
