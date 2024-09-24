import { Command, type CommandProps } from "@undb/domain"
import type { IRecordValues } from "@undb/table"
import { createRecordDTO, recordId, uniqueTableDTO } from "@undb/table"
import { z } from "@undb/zod"

export const createRecordCommand = createRecordDTO.merge(uniqueTableDTO)

export type ICreateRecordCommand = z.infer<typeof createRecordCommand>

export const createRecordCommandOutput = recordId

export type ICreateRecordCommandOutput = z.infer<typeof createRecordCommandOutput>

export class CreateRecordCommand extends Command implements ICreateRecordCommand {
  public readonly id?: string | null
  public readonly tableId?: string
  public readonly baseName?: string
  public readonly tableName?: string
  public readonly values: IRecordValues

  constructor(props: CommandProps<ICreateRecordCommand>) {
    super(props)
    this.id = props.id
    this.tableId = props.tableId
    this.baseName = props.baseName
    this.tableName = props.tableName
    this.values = props.values
  }
}
