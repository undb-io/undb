import { Command, type CommandProps } from "@undb/domain"
import { bulkDuplicateRecordsDTO, uniqueTableDTO, type IViewFilterGroup } from "@undb/table"
import { z } from "@undb/zod"

export const bulkduplicateRecordsCommand = bulkDuplicateRecordsDTO.merge(uniqueTableDTO)

export type IBulkDuplicateRecordsCommand = z.infer<typeof bulkduplicateRecordsCommand>

export class BulkDuplicateRecordsCommand extends Command implements IBulkDuplicateRecordsCommand {
  public readonly tableId?: string
  public readonly baseName?: string
  public readonly tableName?: string
  public readonly filter: IViewFilterGroup
  public readonly isOpenapi?: boolean

  constructor(props: CommandProps<IBulkDuplicateRecordsCommand>) {
    super(props)
    this.tableId = props.tableId
    this.baseName = props.baseName
    this.tableName = props.tableName
    this.filter = props.filter
    this.isOpenapi = props.isOpenapi
  }
}
