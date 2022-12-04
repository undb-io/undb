import { RecordInMemoryRepository } from '@egodb/in-memory-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestRecordInMemoryRepository extends RecordInMemoryRepository {
  constructor() {
    super()
  }
}
