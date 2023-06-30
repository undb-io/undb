import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateShareSchema } from '@undb/integrations'
import type { IUpdateShareCommandInput } from './update-share.command.interface.js'

export class UpdateShareCommand extends Command implements IUpdateShareCommandInput {
  public readonly shareId: string
  public readonly update: IUpdateShareSchema

  constructor(props: CommandProps<IUpdateShareCommandInput>) {
    super(props)
    this.shareId = props.shareId
    this.update = props.update
  }
}
