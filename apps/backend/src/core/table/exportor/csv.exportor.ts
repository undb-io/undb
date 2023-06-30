import { Parser } from '@json2csv/plainjs'
import { Inject, Injectable } from '@nestjs/common'
import type { IRecordExportor } from '@undb/core'
import { type Records, type Table } from '@undb/core'

export const RECORD_CSV_EXPORTOR = Symbol('RECORD_CSV_EXPORTOR')
export const InjectRecordCSVExportor = () => Inject(RECORD_CSV_EXPORTOR)

@Injectable()
export class CSVExportor implements IRecordExportor {
  export(table: Table, viewId: string, data: Records): string {
    if (data.length === 0) {
      const view = table.mustGetView(viewId)
      return table
        .getOrderedFields(view, false)
        .map((f) => f.name.value)
        .join(',')
    }
    const values = data.map((record) => record.toHuman(table, viewId, record.displayValues?.values))
    const parser = new Parser()
    return parser.parse(values)
  }
}
