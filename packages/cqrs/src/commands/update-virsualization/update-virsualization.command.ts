import { IUpdateVirsualizationSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateVirsualizationCommandInput } from './update-virsualization.command.interface.js'

export class UpdateVirsualizationCommand extends Command implements IUpdateVirsualizationCommandInput {
  public readonly tableId: string
  public readonly virsualization: IUpdateVirsualizationSchema

  constructor(props: CommandProps<IUpdateVirsualizationCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.virsualization = props.virsualization
  }
}
