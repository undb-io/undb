import { ValueObject } from '@undb/domain'
import { RLSDetail } from './rls-detail.vo'

export class RLSDetails extends ValueObject<RLSDetail[]> {
  public get details() {
    return this.props
  }
}
