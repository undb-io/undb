import { Command, type CommandProps } from "@undb/domain"
import type { IRecordValues } from "@undb/table"
import { submitFormDTO, uniqueTableDTO } from "@undb/table"
import { z } from "@undb/zod"

export const submitFormCommand = submitFormDTO.merge(uniqueTableDTO)

export type ISubmitFormCommand = z.infer<typeof submitFormCommand>

export class SubmitFormCommand extends Command implements ISubmitFormCommand {
  public readonly tableId?: string
  public readonly form: string
  public readonly baseName?: string
  public readonly tableName?: string
  public readonly values: IRecordValues

  constructor(props: CommandProps<ISubmitFormCommand>) {
    super(props)
    this.tableId = props.tableId
    this.form = props.form
    this.baseName = props.baseName
    this.tableName = props.tableName
    this.values = props.values
  }
}
