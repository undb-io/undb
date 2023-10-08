import { BaseFactory } from '../base.factory'
import type { BaseSpecification } from '../interface'
import { WithBaseId, WithBaseName } from '../specifications'

export const createTestBase = (...specs: BaseSpecification[]) => {
  let spec = WithBaseId.fromString('baseId').and(WithBaseName.fromString('name'))

  for (const s of specs) {
    spec = spec.and(s)
  }

  return BaseFactory.create(spec)
}
