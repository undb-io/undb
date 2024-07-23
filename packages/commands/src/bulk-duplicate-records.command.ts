import { Command, type CommandProps } from "@undb/domain"
import { bulkDuplicateRecordsDTO, tableId, type IViewFilterGroup } from "@undb/table"
import { z } from "@undb/zod"

export const bulkduplicateRecordsCommand = bulkDuplicateRecordsDTO.extend({
  tableId,
})

export type IBulkDuplicateRecordsCommand = z.infer<typeof bulkduplicateRecordsCommand>

export class BulkDuplicateRecordsCommand extends Command implements IBulkDuplicateRecordsCommand {
  public readonly tableId: string
  public readonly filter: IViewFilterGroup
  public readonly isOpenapi?: boolean

  constructor(props: CommandProps<IBulkDuplicateRecordsCommand>) {
    super(props)
    this.tableId = props.tableId
    this.filter = props.filter
    this.isOpenapi = props.isOpenapi
  }
}
