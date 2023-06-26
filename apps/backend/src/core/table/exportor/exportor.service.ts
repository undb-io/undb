import { Injectable } from '@nestjs/common'
import { RecordExportorService, type IRecordExportor } from '@undb/core'
import { InjectRecordCSVExportor } from './csv.exportor.js'
import { InjectRecordExcelExportor } from './excel.exportor.js'

@Injectable()
export class NestRecordExportorService extends RecordExportorService {
  constructor(
    @InjectRecordCSVExportor()
    protected readonly csvExportor: IRecordExportor,
    @InjectRecordExcelExportor()
    protected readonly excelExportor: IRecordExportor,
  ) {
    super(csvExportor, excelExportor)
  }
}
