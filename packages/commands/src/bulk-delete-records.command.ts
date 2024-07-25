import { Command, type CommandProps } from "@undb/domain"
import { bulkDeleteRecordsDTO, uniqueTableDTO, type IViewFilterGroup } from "@undb/table"
import { z } from "@undb/zod"

export const bulkdeleteRecordsCommand = bulkDeleteRecordsDTO.merge(uniqueTableDTO)

export type IBulkDeleteRecordsCommand = z.infer<typeof bulkdeleteRecordsCommand>

export class BulkDeleteRecordsCommand extends Command implements IBulkDeleteRecordsCommand {
  public readonly tableId?: string
  public readonly baseName?: string
  public readonly tableName?: string
  public readonly filter: IViewFilterGroup
  public readonly isOpenapi?: boolean

  constructor(props: CommandProps<IBulkDeleteRecordsCommand>) {
    super(props)
    this.tableId = props.tableId
    this.baseName = props.baseName
    this.tableName = props.tableName
    this.filter = props.filter
    this.isOpenapi = props.isOpenapi
  }
}
