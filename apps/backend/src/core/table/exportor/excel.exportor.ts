import * as XLSX from 'xlsx'
import { IRecordExportor, type Records, type Table } from '@undb/core'

export class ExcelExportor implements IRecordExportor {
  export(table: Table, viewId: string, data: Records): Buffer {
    const values = data.map((record) => record.toHuman(table, viewId, record.displayValues?.values))
    const wb = XLSX.utils.book_new()
    const view = table.mustGetView(viewId)
    const xlsxData = XLSX.utils.json_to_sheet(values, {
      header: table.getOrderedFields(view, false).map((f) => f.name.value),
    })
    XLSX.utils.book_append_sheet(wb, xlsxData, table.name.value)
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  }
}
