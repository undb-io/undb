import { Command, type CommandProps } from "@undb/domain"
import { bulkDeleteRecordsDTO, tableId, type IViewFilterGroup } from "@undb/table"
import { z } from "@undb/zod"

export const bulkdeleteRecordsCommand = bulkDeleteRecordsDTO.extend({
  tableId,
})

export type IBulkDeleteRecordsCommand = z.infer<typeof bulkdeleteRecordsCommand>

export class BulkDeleteRecordsCommand extends Command implements IBulkDeleteRecordsCommand {
  public readonly tableId: string
  public readonly filter: IViewFilterGroup
  public readonly isOpenapi?: boolean

  constructor(props: CommandProps<IBulkDeleteRecordsCommand>) {
    super(props)
    this.tableId = props.tableId
    this.filter = props.filter
    this.isOpenapi = props.isOpenapi
  }
}
