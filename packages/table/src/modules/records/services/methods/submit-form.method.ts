import { Some } from "@undb/domain"
import type { IUniqueTableDTO } from "../../../../dto"
import { withUniqueTable } from "../../../../specifications"
import { FormIdVO } from "../../../forms/form/form-id.vo"
import { RecordDO, type ISubmitFormDTO } from "../../record"
import type { RecordsService } from "../records.service"

export async function submitFormMethod(
  this: RecordsService,
  t: IUniqueTableDTO,
  dto: ISubmitFormDTO,
): Promise<RecordDO> {
  const spec = withUniqueTable(t).unwrap()
  const table = (await this.tableRepository.findOne(Some(spec))).expect("Table not found")
  const form = table.forms?.getFormnByIdOrName(dto.form)
  if (!form) {
    throw new Error("Form not found")
  }

  const defaultValue = table.getDefaultValues(new FormIdVO(form.id))

  const record = RecordDO.create(table, { values: { ...defaultValue, ...dto.values } })
  await this.repo.insert(table, record)

  return record
}
