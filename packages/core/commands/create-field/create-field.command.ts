import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ICreateFieldSchema } from '../../field'
import type { ICreateFieldCommandInput } from './create-field.command.interface'

export class CreateFieldCommand extends Command implements ICreateFieldCommandInput {
  public readonly id: string
  public readonly field: ICreateFieldSchema

  constructor(props: CommandProps<ICreateFieldCommandInput>) {
    super(props)
    this.id = props.id
    this.field = props.field
  }
}
