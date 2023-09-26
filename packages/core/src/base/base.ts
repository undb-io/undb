import { and } from '@undb/domain'
import type { Option } from 'oxide.ts'
import type { IUpdateBaseSchema } from './base.schema.js'
import type { BaseSpecification } from './interface.js'
import { WithBaseName } from './specifications/base-name.specification.js'
import type { BaseId, BaseName } from './value-objects/index.js'

export class Base {
  id!: BaseId
  name!: BaseName

  static empty() {
    return new this()
  }

  public update(schema: IUpdateBaseSchema): Option<BaseSpecification> {
    const specs: BaseSpecification[] = []

    if (schema.name) {
      specs.push(WithBaseName.fromString(schema.name))
    }

    return and(...specs)
  }
}
