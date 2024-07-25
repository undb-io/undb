import { Command, type CommandProps } from "@undb/domain"
import { deleteRecordDTO, uniqueTableDTO } from "@undb/table"
import { z } from "@undb/zod"

export const deleteRecordCommand = deleteRecordDTO.merge(uniqueTableDTO)

export type IDeleteRecordCommand = z.infer<typeof deleteRecordCommand>

export class DeleteRecordCommand extends Command implements IDeleteRecordCommand {
  public readonly tableId?: string
  public readonly baseName?: string
  public readonly tableName?: string
  public readonly id: string

  constructor(props: CommandProps<IDeleteRecordCommand>) {
    super(props)
    this.tableId = props.tableId
    this.baseName = props.baseName
    this.tableName = props.tableName
    this.id = props.id
  }
}
