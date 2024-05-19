import { Command, type CommandProps } from "@undb/domain"
import type { IRecordValues } from "@undb/table"
import { tableId, updateRecordDTO } from "@undb/table"
import { z } from "zod"

export const updateRecordCommand = updateRecordDTO.extend({
  tableId,
})

export type IUpdateRecordCommand = z.infer<typeof updateRecordCommand>

export class UpdateRecordCommand extends Command implements IUpdateRecordCommand {
  public readonly id: string
  public readonly tableId: string
  public readonly values: IRecordValues

  constructor(props: CommandProps<IUpdateRecordCommand>) {
    super(props)
    this.id = props.id
    this.tableId = props.tableId
    this.values = props.values
  }
}
