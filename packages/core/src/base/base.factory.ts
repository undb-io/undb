import { and } from '@undb/domain'
import { Base } from './base.js'
import type { BaseSpecification } from './interface.js'

export class BaseFactory {
  static create(...specs: BaseSpecification[]): Base {
    return and(...specs)
      .unwrap()
      .mutate(Base.empty())
      .unwrap()
  }
}
