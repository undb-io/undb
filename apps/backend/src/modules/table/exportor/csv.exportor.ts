import { Parser } from '@json2csv/plainjs'
import { IRecordExportor } from '@undb/core'

export class CSVExportor implements IRecordExportor {
  export(data: any): any {
    const parser = new Parser()
    const csv = parser.parse([{ a: 1 }, { a: 2 }, { a: 3 }])

    return csv
  }
}
