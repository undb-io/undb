import type { IRecordQueryModel } from '@egodb/core'
import { RecordInMemoryQueryModel } from '@egodb/in-memory-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRecordInMemoryQueryModel extends RecordInMemoryQueryModel implements IRecordQueryModel {
  constructor() {
    super()
  }
}
