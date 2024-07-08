import { Command, type CommandProps } from "@undb/domain"
import { bulkUpdateRecordsDTO, tableId, type IRecordValues, type IViewFilterGroup } from "@undb/table"
import { z } from "@undb/zod"

export const bulkUpdateRecordsCommand = bulkUpdateRecordsDTO.extend({
  tableId,
})

export type IBulkUpdateRecordsCommand = z.infer<typeof bulkUpdateRecordsCommand>

export class BulkUpdateRecordsCommand extends Command implements IBulkUpdateRecordsCommand {
  public readonly tableId: string
  public readonly filter: IViewFilterGroup
  public readonly values: IRecordValues

  constructor(props: CommandProps<IBulkUpdateRecordsCommand>) {
    super(props)
    this.tableId = props.tableId
    this.filter = props.filter
    this.values = props.values
  }
}
