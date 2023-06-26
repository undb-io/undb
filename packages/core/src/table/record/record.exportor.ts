import { match } from 'ts-pattern'
import { z } from 'zod'
import type { Table } from '../table'
import type { Records } from './record.type'

export const exportType = z.enum(['csv', 'excel'])

export type IExportType = z.infer<typeof exportType>

export interface IRecordExportor {
  export(table: Table, viewId: string, data: Records): string | Buffer
}

export class RecordExportorService {
  constructor(protected readonly csvExportor: IRecordExportor, protected readonly excelExportor: IRecordExportor) {}

  public getExportor(type: IExportType): IRecordExportor {
    return match(type)
      .with('csv', () => this.csvExportor)
      .with('excel', () => this.excelExportor)
      .exhaustive()
  }
}
