import type { ITableQueryModel } from '@egodb/core'
import { TableInMemoryQueryModel } from '@egodb/in-memory-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestTableInMemoryQueryModel extends TableInMemoryQueryModel implements ITableQueryModel {
  constructor() {
    super()
  }
}
