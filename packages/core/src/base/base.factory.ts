import { and } from '@undb/domain'
import { Base } from './base.js'
import type { ICreateBaseSchema } from './base.schema.js'
import type { BaseSpecification } from './interface.js'
import { WithBaseId } from './specifications/base-id.specification.js'
import { WithBaseName } from './specifications/base-name.specification.js'
import { BaseId } from './value-objects/base-id.vo.js'

export class BaseFactory {
  static create(...specs: BaseSpecification[]): Base {
    return and(...specs)
      .unwrap()
      .mutate(Base.empty())
      .unwrap()
  }

  static new(input: ICreateBaseSchema): Base {
    return this.create(new WithBaseId(BaseId.fromOrCreate(input.id)), WithBaseName.fromString(input.name))
  }
}
