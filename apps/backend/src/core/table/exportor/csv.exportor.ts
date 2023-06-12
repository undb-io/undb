import { Parser } from '@json2csv/plainjs'
import { IRecordExportor, type Records, type Table } from '@undb/core'

export class CSVExportor implements IRecordExportor {
  export(table: Table, viewId: string, data: Records): string {
    const values = data.map((record) => record.toHuman(table, viewId, record.displayValues?.values))

    const parser = new Parser()
    const csv = parser.parse(values)

    return csv
  }
}
