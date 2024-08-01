import { Command, type CommandProps } from "@undb/domain"
import { duplicateRecordDTO, uniqueTableDTO } from "@undb/table"
import { z } from "@undb/zod"

export const duplicateRecordCommand = duplicateRecordDTO.merge(uniqueTableDTO)

export type IDuplicateRecordCommand = z.infer<typeof duplicateRecordCommand>

export class DuplicateRecordCommand extends Command implements IDuplicateRecordCommand {
  public readonly id: string
  public readonly tableId?: string
  public readonly baseName?: string
  public readonly tableName?: string

  constructor(props: CommandProps<IDuplicateRecordCommand>) {
    super(props)
    this.id = props.id
    this.tableId = props.tableId
    this.baseName = props.baseName
    this.tableName = props.tableName
  }
}
