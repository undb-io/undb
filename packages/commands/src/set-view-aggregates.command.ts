import { Command, type CommandProps } from "@undb/domain"
import { setViewAggregatesDTO, type IViewAggregate } from "@undb/table"
import { z } from "@undb/zod"

export const setViewAggregatesCommand = setViewAggregatesDTO

export type ISetViewAggregatesCommand = z.infer<typeof setViewAggregatesCommand>

export class SetViewAggregatesCommand extends Command implements ISetViewAggregatesCommand {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly aggregates: IViewAggregate

  constructor(props: CommandProps<ISetViewAggregatesCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.aggregates = props.aggregates
  }
}
