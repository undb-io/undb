import { None, Option, Some } from "@undb/domain"
import { withUniqueTable } from "../../../../specifications"
import type { IGetRecordByIdDTO } from "../../dto"
import { RecordIdVO, type IRecordDTO, type SingleQueryArgs } from "../../record"
import type { RecordsQueryService } from "../records.query-service"

export async function getRecordById(this: RecordsQueryService, dto: IGetRecordByIdDTO): Promise<Option<IRecordDTO>> {
  const ts = withUniqueTable(dto).unwrap()
  const table = (await this.tableRepository.findOne(Some(ts))).expect("Table not found")
  const view = table.views.getViewByNameOrId(dto.viewName, dto.viewId)

  const query: SingleQueryArgs = {
    select: None,
    view,
    ignoreView: dto.ignoreView,
  }

  if (dto.select) {
    query.select = Some(dto.select)
  }

  const record = await this.repo.findOneById(table, new RecordIdVO(dto.id), Some(query))
  if (record.isNone()) {
    return None
  }

  const r = record.unwrap()
  const values = await this.populateAttachment(dto, table, r.values)
  return Some({
    ...r,
    values,
  })
}
