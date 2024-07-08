import { Command, type CommandProps } from "@undb/domain"
import { bulkdeleteRecordsDTO, tableId } from "@undb/table"
import { z } from "@undb/zod"

export const bulkdeleteRecordsCommand = bulkdeleteRecordsDTO.extend({
  tableId,
})

export type IBulkDeleteRecordsCommand = z.infer<typeof bulkdeleteRecordsCommand>

export class BulkDeleteRecordsCommand extends Command implements IBulkDeleteRecordsCommand {
  public readonly tableId: string
  public readonly ids: [string, ...string[]]

  constructor(props: CommandProps<IBulkDeleteRecordsCommand>) {
    super(props)
    this.tableId = props.tableId
    this.ids = props.ids
  }
}
