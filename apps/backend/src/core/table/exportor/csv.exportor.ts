import { Parser } from '@json2csv/plainjs'
import { IRecordExportor, type Records, type Table } from '@undb/core'

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
