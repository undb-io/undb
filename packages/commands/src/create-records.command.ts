import { Command, type CommandProps } from "@undb/domain"
import type { ICreateRecordDTO } from "@undb/table"
import { createRecordDTO, tableId } from "@undb/table"
import { z } from "@undb/zod"

export const createRecordsCommand = z.object({
  tableId,
  records: createRecordDTO.array(),
})

export type ICreateRecordsCommand = z.infer<typeof createRecordsCommand>

export class CreateRecordsCommand extends Command implements ICreateRecordsCommand {
  public readonly tableId: string
  public readonly records: ICreateRecordDTO[]

  constructor(props: CommandProps<ICreateRecordsCommand>) {
    super(props)
    this.tableId = props.tableId
    this.records = props.records
  }
}
