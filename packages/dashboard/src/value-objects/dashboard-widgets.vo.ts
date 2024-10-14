import { ValueObject } from "@undb/domain"
import { tableId, widgetDTO, WidgetVO } from "@undb/table"
import * as z from "@undb/zod"
import { WithDashboardWidgets, type DashboardComositeSpecification } from "../specifications"

export const dashboardWidgetSchema = z.object({
  table: z.object({
    id: tableId.optional(),
  }),
  widget: widgetDTO,
})

export type IDashboardWidget = z.infer<typeof dashboardWidgetSchema>

export class DashboardWidget extends ValueObject<IDashboardWidget> {
  static default(tableId: string | undefined, name = "Count") {
    return new DashboardWidget({
      table: {
        id: tableId,
      },
      widget: WidgetVO.default(name).toJSON(),
    })
  }

  toJSON(): IDashboardWidget {
    return {
      widget: this.props.widget,
      table: {
        id: this.props.table.id,
      },
    }
  }
}

export const dashboardWidgetsSchema = z.array(dashboardWidgetSchema)

export type IDashboardWidgets = z.infer<typeof dashboardWidgetsSchema>

export class DashboardWidgets extends ValueObject<IDashboardWidgets> {
  static from(widgets: IDashboardWidgets): DashboardWidgets {
    return new DashboardWidgets(dashboardWidgetsSchema.parse(widgets))
  }

  addWidget(widget: IDashboardWidget): IDashboardWidgets {
    return [...this.value, widget]
  }

  $addWidget(widget: IDashboardWidget): DashboardComositeSpecification {
    const widgets = this.addWidget(widget)
    return new WithDashboardWidgets(widgets)
  }
}
