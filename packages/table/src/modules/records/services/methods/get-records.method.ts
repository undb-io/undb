import { None } from '@undb/domain'
import { TableIdVo } from '../../../../table-id.vo'
import type { IGetRecordsDTO, IRecordsDTO } from '../../dto'
import type { RecordsQueryService } from '../records.query-service'

export async function getRecords(this: RecordsQueryService, dto: IGetRecordsDTO): Promise<IRecordsDTO> {
  const tableId = new TableIdVo(dto.tableId)
  const table = (await this.tableRepository.findOneById(tableId)).expect('Table not found')

  return this.repo.find(table, None)
}
