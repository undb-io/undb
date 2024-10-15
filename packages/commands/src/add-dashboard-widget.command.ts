import { addDashboardWidgetDTO, type IDashboardLayout, type IDashboardWidget } from "@undb/dashboard"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const addDashboardWidgetCommand = addDashboardWidgetDTO

export type IAddDashboardWidgetCommand = z.infer<typeof addDashboardWidgetCommand>

export class AddDashboardWidgetCommand extends Command implements IAddDashboardWidgetCommand {
  public readonly dashboardId: string
  public readonly widget: IDashboardWidget
  public readonly layout: IDashboardLayout

  constructor(props: CommandProps<IAddDashboardWidgetCommand>) {
    super(props)
    this.dashboardId = props.dashboardId
    this.widget = props.widget
    this.layout = props.layout
  }
}
