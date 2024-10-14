import { addWidgetDTO, type IDashboardWidget } from "@undb/dashboard"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const addDashboardWidgetCommand = addWidgetDTO

export type IAddDashboardWidgetCommand = z.infer<typeof addDashboardWidgetCommand>

export class AddDashboardWidgetCommand extends Command implements IAddDashboardWidgetCommand {
  public readonly dashboardId: string
  public readonly widget: IDashboardWidget

  constructor(props: CommandProps<IAddDashboardWidgetCommand>) {
    super(props)
    this.dashboardId = props.dashboardId
    this.widget = props.widget
  }
}
