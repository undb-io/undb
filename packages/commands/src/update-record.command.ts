import { Command, type CommandProps } from "@undb/domain"
import type { IRecordValues } from "@undb/table"
import { uniqueTableDTO, updateRecordDTO } from "@undb/table"
import { z } from "@undb/zod"

export const updateRecordCommand = updateRecordDTO.merge(uniqueTableDTO)

export type IUpdateRecordCommand = z.infer<typeof updateRecordCommand>

export class UpdateRecordCommand extends Command implements IUpdateRecordCommand {
  public readonly id: string
  public readonly tableId?: string
  public readonly tableName?: string
  public readonly baseName?: string
  public readonly values: IRecordValues

  constructor(props: CommandProps<IUpdateRecordCommand>) {
    super(props)
    this.id = props.id
    this.values = props.values
    this.tableId = props.tableId
    this.baseName = props.baseName
    this.tableName = props.tableName
  }
}
