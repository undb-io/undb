import { Command, type CommandProps } from "@undb/domain"
import type { IRecordValues } from "@undb/table"
import { createRecordDTO, tableId } from "@undb/table"
import { z } from "@undb/zod"

export const createRecordCommand = createRecordDTO.extend({
  tableId,
})

export type ICreateRecordCommand = z.infer<typeof createRecordCommand>

export class CreateRecordCommand extends Command implements ICreateRecordCommand {
  public readonly tableId: string
  public readonly values: IRecordValues

  constructor(props: CommandProps<ICreateRecordCommand>) {
    super(props)
    this.tableId = props.tableId
    this.values = props.values
  }
}
