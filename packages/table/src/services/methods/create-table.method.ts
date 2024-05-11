import type { ICreateTableDTO } from '../../dto'
import type { TableDo } from '../../table.do'
import type { TableService } from '../table.service'

export async function createTableMethod(this: TableService, dto: ICreateTableDTO): Promise<TableDo> {
  const table = this.creator.create(dto)

  await this.repository.insert(table)

  return table
}
