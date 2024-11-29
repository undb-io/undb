import { Command, type CommandProps } from "@undb/domain"
import { bulkUpdateRecordsDTO, uniqueTableDTO, type IRecordValues, type IViewFilterGroup } from "@undb/table"
import { z } from "@undb/zod"

export const bulkUpdateRecordsCommand = bulkUpdateRecordsDTO.merge(uniqueTableDTO)

export type IBulkUpdateRecordsCommand = z.infer<typeof bulkUpdateRecordsCommand>

export const bulkUpdateRecordsCommandOutput = z.object({
  modifiedCount: z.number(),
})

export type IBulkUpdateRecordsCommandOutput = z.infer<typeof bulkUpdateRecordsCommandOutput>

export class BulkUpdateRecordsCommand extends Command implements IBulkUpdateRecordsCommand {
  public readonly tableId?: string
  public readonly baseName?: string
  public readonly tableName?: string
  public readonly filter?: IViewFilterGroup
  public readonly values: IRecordValues
  public readonly isOpenapi?: boolean

  constructor(props: CommandProps<IBulkUpdateRecordsCommand>) {
    super(props)
    this.tableId = props.tableId
    this.baseName = props.baseName
    this.tableName = props.tableName
    this.filter = props.filter
    this.values = props.values
    this.isOpenapi = props.isOpenapi
  }
}
