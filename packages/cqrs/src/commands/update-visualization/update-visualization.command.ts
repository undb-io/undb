import { IUpdateVisualizationSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateVisualizationCommandInput } from './update-visualization.command.interface.js'

export class UpdateVisualizationCommand extends Command implements IUpdateVisualizationCommandInput {
  public readonly tableId: string
  public readonly visualization: IUpdateVisualizationSchema

  constructor(props: CommandProps<IUpdateVisualizationCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.visualization = props.visualization
  }
}
