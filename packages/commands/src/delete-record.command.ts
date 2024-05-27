import { Command, type CommandProps } from "@undb/domain"
import { deleteRecordDTO, tableId } from "@undb/table"
import { z } from "@undb/zod"

export const deleteRecordCommand = deleteRecordDTO.extend({
  tableId,
})

export type IDeleteRecordCommand = z.infer<typeof deleteRecordCommand>

export class DeleteRecordCommand extends Command implements IDeleteRecordCommand {
  public readonly tableId: string
  public readonly id: string

  constructor(props: CommandProps<IDeleteRecordCommand>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
  }
}
