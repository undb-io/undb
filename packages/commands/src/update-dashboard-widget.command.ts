import { updateDashboardWidgetDTO, type IDashboardWidget } from "@undb/dashboard"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const updateDashboardWidgetCommand = updateDashboardWidgetDTO

export type IUpdateDashboardWidgetCommand = z.infer<typeof updateDashboardWidgetCommand>

export class UpdateDashboardWidgetCommand extends Command implements IUpdateDashboardWidgetCommand {
  public readonly id: string
  public readonly widget: IDashboardWidget

  constructor(props: CommandProps<IUpdateDashboardWidgetCommand>) {
    super(props)
    this.id = props.id
    this.widget = props.widget
  }
}
