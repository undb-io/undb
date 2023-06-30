import { Inject, Injectable } from '@nestjs/common'
import type { IRecordExportor } from '@undb/core'
import { type Records, type Table } from '@undb/core'

export const RECORD_JSON_EXPORTOR = Symbol('RECORD_JSON_EXPORTOR')
export const InjectRecordJsonExportor = () => Inject(RECORD_JSON_EXPORTOR)

@Injectable()
export class JsonExportor implements IRecordExportor {
  export(table: Table, viewId: string, data: Records): string {
    const values = data.map((record) => record.toHuman(table, viewId, record.displayValues?.values))
    return JSON.stringify(values)
  }
}
