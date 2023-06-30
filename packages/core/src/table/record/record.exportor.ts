import { match } from 'ts-pattern'
import { z } from 'zod'
import type { Table } from '../table'
import type { Records } from './record.type'

export const exportType = z.enum(['csv', 'excel', 'json'])

export type IExportType = z.infer<typeof exportType>

export interface IRecordExportor {
  export(table: Table, viewId: string, data: Records): string | Buffer
}

export class RecordExportorService {
  constructor(
    protected readonly csvExportor: IRecordExportor,
    protected readonly excelExportor: IRecordExportor,
    protected readonly jsonExportor: IRecordExportor,
  ) {}

  public getExportor(type: IExportType): IRecordExportor {
    return match(type)
      .with('csv', () => this.csvExportor)
      .with('excel', () => this.excelExportor)
      .with('json', () => this.jsonExportor)
      .exhaustive()
  }

  public getContentType(type: IExportType): string {
    return match(type)
      .with('csv', () => 'text/csv')
      .with('excel', () => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      .with('json', () => 'application/json')
      .exhaustive()
  }
}
