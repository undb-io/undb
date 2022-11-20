import { ITableRepository, Table } from '@egodb/core'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TableInmMemoryRepository implements ITableRepository {
  async findOneById(id: string): Promise<Table> {
    throw new Error('[TableInmMemoryRepository.findOnyById] Method not implemented.')
  }

  async insert(table: Table): Promise<void> {
    throw new Error('[TableInmMemoryRepository.insert] Method not implemented.')
  }
}
