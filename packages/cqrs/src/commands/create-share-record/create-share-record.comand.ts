import type { IMutateRecordValueSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IShareTarget } from '@undb/integrations'
import type { ICreateShareRecordInput } from './create-share-record.command.input.js'

export class CreateShareRecordCommand extends Command implements ICreateShareRecordInput {
  readonly id?: string
  readonly tableId: string
  readonly target: IShareTarget
  readonly values: IMutateRecordValueSchema

  constructor(props: CommandProps<ICreateShareRecordInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
    this.target = props.target
    this.values = props.values
  }
}
