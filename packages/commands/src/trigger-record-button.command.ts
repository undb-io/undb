import { Command, type CommandProps } from "@undb/domain"
import { fieldId, fieldName, recordId, uniqueTableDTO } from "@undb/table"
import { z } from "@undb/zod"

export const triggerRecordButtonCommand = z
  .object({
    recordId,
    field: fieldId.or(fieldName),
  })
  .merge(uniqueTableDTO)

export type ITriggerRecordButtonCommand = z.infer<typeof triggerRecordButtonCommand>

export class TriggerRecordButtonCommand extends Command implements ITriggerRecordButtonCommand {
  public readonly recordId: string
  public readonly field: string
  public readonly tableId?: string
  public readonly tableName?: string
  public readonly baseName?: string

  constructor(props: CommandProps<ITriggerRecordButtonCommand>) {
    super(props)
    this.recordId = props.recordId
    this.field = props.field
    this.tableId = props.tableId
    this.baseName = props.baseName
    this.tableName = props.tableName
  }
}
