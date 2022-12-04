import type { IRecordQueryModel } from '@egodb/core/dist'
import { RecordInMemoryQueryModel } from '@egodb/in-memory-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRecordInMemoryQueryModel extends RecordInMemoryQueryModel implements IRecordQueryModel {
  constructor() {
    super()
  }
}
