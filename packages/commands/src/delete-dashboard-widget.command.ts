import { deleteDashboardWidgetDTO } from "@undb/dashboard"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const deleteDashboardWidgetCommand = deleteDashboardWidgetDTO

export type IDeleteDashboardWidgetCommand = z.infer<typeof deleteDashboardWidgetCommand>

export class DeleteDashboardWidgetCommand extends Command implements IDeleteDashboardWidgetCommand {
  public readonly dashboardId: string
  public readonly widgetId: string

  constructor(props: CommandProps<IDeleteDashboardWidgetCommand>) {
    super(props)
    this.dashboardId = props.dashboardId
    this.widgetId = props.widgetId
  }
}
