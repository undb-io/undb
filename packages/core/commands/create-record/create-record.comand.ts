import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ICreateRecordInput } from './create-record.command.input'

export class CreateRecordCommand extends Command {
  readonly id?: string

  constructor(props: CommandProps<ICreateRecordInput>) {
    super(props)
    this.id = props.id
  }
}
