import { Command, type CommandProps } from "@undb/domain"
import type { ICreateRecordDTO } from "@undb/table"
import { createRecordDTO, uniqueTableDTO } from "@undb/table"
import { z } from "@undb/zod"

export const createRecordsCommand = z
  .object({
    records: createRecordDTO.array(),
  })
  .merge(uniqueTableDTO)

export type ICreateRecordsCommand = z.infer<typeof createRecordsCommand>

export const createRecordsCommandOutput = z.void()

export type ICreateRecordsCommandOutput = z.infer<typeof createRecordsCommandOutput>

export class CreateRecordsCommand extends Command implements ICreateRecordsCommand {
  public readonly tableId?: string
  public readonly tableName?: string
  public readonly baseName?: string
  public readonly records: ICreateRecordDTO[]

  constructor(props: CommandProps<ICreateRecordsCommand>) {
    super(props)
    this.tableId = props.tableId
    this.tableName = props.tableName
    this.baseName = props.baseName
    this.records = props.records
  }
}
