import { refineRecordEvents, type Record, type RecordEvents, type Records, type Table } from '@undb/core'
import type { Option } from 'oxide.ts'
import { RLSNotAuthorized } from '../rls.errors.js'
import type { IRLSAction } from '../value-objects/index.js'
import { RLSRecordSpecService } from './rls-record-spec.service.js'

export interface IRLSAuthzService {
  check(action: IRLSAction, table: Table, record: Record): Promise<void>
  checkMany(action: IRLSAction, table: Table, records: Records): Promise<void>

  refineEvent(event: RecordEvents, table: Table): Promise<Option<RecordEvents>>
}

export class RLSAuthzService extends RLSRecordSpecService implements IRLSAuthzService {
  async checkMany(action: IRLSAction, table: Table, records: Records): Promise<void> {
    const spec = await this.getSpec(action, table.id.value)
    if (spec.isNone()) return

    for (const record of records) {
      const isSatisfiedBy = spec.unwrap().isSatisfiedBy(record)
      if (!isSatisfiedBy) throw new RLSNotAuthorized()
    }
  }

  async check(action: IRLSAction, table: Table, record: Record): Promise<void> {
    const spec = await this.getSpec(action, table.id.value)
    if (spec.isNone()) return

    const isSatisfiedBy = spec.unwrap().isSatisfiedBy(record)
    if (!isSatisfiedBy) throw new RLSNotAuthorized()
  }

  async refineEvent(event: RecordEvents, table: Table): Promise<Option<RecordEvents>> {
    const spec = await this.getSpec(['list', 'view'], table.id.value)
    return refineRecordEvents(table, event, spec)
  }
}
