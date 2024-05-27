import { Command, type CommandProps } from "@undb/domain"
import { tableId, duplicateRecordDTO } from "@undb/table"
import { z } from "@undb/zod"

export const duplicateRecordCommand = duplicateRecordDTO.extend({
  tableId,
})

export type IDuplicateRecordCommand = z.infer<typeof duplicateRecordCommand>

export class DuplicateRecordCommand extends Command implements IDuplicateRecordCommand {
  public readonly id: string
  public readonly tableId: string

  constructor(props: CommandProps<IDuplicateRecordCommand>) {
    super(props)
    this.id = props.id
    this.tableId = props.tableId
  }
}
