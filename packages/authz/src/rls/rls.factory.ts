import { and } from '@undb/domain'
import { RLSSpecification } from './interface'
import { RLS } from './rls'

export class RLSFactory {
  static create(...specs: RLSSpecification[]) {
    return and(...specs)
      .unwrap()
      .mutate(RLS.empty())
      .unwrap()
  }
}
