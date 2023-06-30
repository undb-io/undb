import { Injectable } from '@nestjs/common'
import { RecordExportorService, type IRecordExportor } from '@undb/core'
import { InjectRecordCSVExportor } from './csv.exportor.js'
import { InjectRecordExcelExportor } from './excel.exportor.js'
import { InjectRecordJsonExportor } from './json.exportor.js'

@Injectable()
export class NestRecordExportorService extends RecordExportorService {
  constructor(
    @InjectRecordCSVExportor()
    protected readonly csvExportor: IRecordExportor,
    @InjectRecordExcelExportor()
    protected readonly excelExportor: IRecordExportor,
    @InjectRecordJsonExportor()
    protected readonly jsonExportor: IRecordExportor,
  ) {
    super(csvExportor, excelExportor, jsonExportor)
  }
}
