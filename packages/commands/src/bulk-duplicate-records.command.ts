import { Command, type CommandProps } from "@undb/domain"
import { bulkduplicateRecordsDTO, tableId } from "@undb/table"
import { z } from "@undb/zod"

export const bulkduplicateRecordsCommand = bulkduplicateRecordsDTO.extend({
  tableId,
})

export type IBulkDuplicateRecordsCommand = z.infer<typeof bulkduplicateRecordsCommand>

export class BulkDuplicateRecordsCommand extends Command implements IBulkDuplicateRecordsCommand {
  public readonly tableId: string
  public readonly ids: [string, ...string[]]

  constructor(props: CommandProps<IBulkDuplicateRecordsCommand>) {
    super(props)
    this.tableId = props.tableId
    this.ids = props.ids
  }
}
