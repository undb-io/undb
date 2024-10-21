import { duplicateDashboardWidgetDTO, type IDashboardLayout } from "@undb/dashboard"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const duplicateDashboardWidgetCommand = duplicateDashboardWidgetDTO

export type IDuplicateDashboardWidgetCommand = z.infer<typeof duplicateDashboardWidgetCommand>

export class DuplicateDashboardWidgetCommand extends Command implements IDuplicateDashboardWidgetCommand {
  public readonly dashboardId: string
  public readonly widgetId: string
  public readonly layout: IDashboardLayout

  constructor(props: CommandProps<IDuplicateDashboardWidgetCommand>) {
    super(props)
    this.dashboardId = props.dashboardId
    this.widgetId = props.widgetId
    this.layout = props.layout
  }
}
