import { relayoutDashboardWidgetsDTO, type IDashboardLayouts } from "@undb/dashboard"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const relayoutDashboardWidgetsCommand = relayoutDashboardWidgetsDTO

export type IRelayoutDashboardWidgetsCommand = z.infer<typeof relayoutDashboardWidgetsCommand>

export class RelayoutDashboardWidgetsCommand extends Command implements IRelayoutDashboardWidgetsCommand {
  public readonly dashboardId: string
  public readonly layout: IDashboardLayouts

  constructor(props: CommandProps<IRelayoutDashboardWidgetsCommand>) {
    super(props)
    this.dashboardId = props.dashboardId
    this.layout = props.layout
  }
}
