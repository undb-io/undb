import { Inject, Injectable } from '@nestjs/common'
import type { IRecordExportor } from '@undb/core'
import { type Records, type Table } from '@undb/core'
import * as XLSX from 'xlsx'

export const RECORD_EXCEL_EXPORTOR = Symbol('RECORD_EXCEL_EXPORTOR')
export const InjectRecordExcelExportor = () => Inject(RECORD_EXCEL_EXPORTOR)

@Injectable()
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
