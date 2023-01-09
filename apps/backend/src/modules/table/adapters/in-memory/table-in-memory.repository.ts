import { TableInMemoryRepository } from '@egodb/in-memory-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestTableInMemoryRepository extends TableInMemoryRepository {
  constructor() {
    super()
  }
}
