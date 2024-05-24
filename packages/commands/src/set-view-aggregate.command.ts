import { Command, type CommandProps } from "@undb/domain"
import { setViewAggregateDTO, type IViewAggregate } from "@undb/table"
import { z } from "@undb/zod"

export const setViewAggregateCommand = setViewAggregateDTO

export type ISetViewAggregateCommand = z.infer<typeof setViewAggregateCommand>

export class SetViewAggregateCommand extends Command implements ISetViewAggregateCommand {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly aggregate: IViewAggregate

  constructor(props: CommandProps<ISetViewAggregateCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.aggregate = props.aggregate
  }
}
