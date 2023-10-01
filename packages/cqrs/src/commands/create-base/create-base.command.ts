import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ITemplateSchema } from '@undb/template'
import type { ICreateBaseCommandInput } from './create-base.command.interface.js'

export class CreateBaseCommand extends Command implements ICreateBaseCommandInput {
  public readonly id?: string
  public readonly name: string
  public readonly tableIds?: [string, ...string[]]
  public readonly template?: ITemplateSchema

  constructor(props: CommandProps<ICreateBaseCommandInput>) {
    super(props)
    this.id = props.id
    this.name = props.name
    this.tableIds = props.tableIds
    this.template = props.template
  }
}
