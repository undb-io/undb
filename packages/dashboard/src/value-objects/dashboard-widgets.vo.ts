import { None, Option, Some, ValueObject } from "@undb/domain"
import { TableDo, tableId, widgetDTO, WidgetVO, type IWidgetDTO } from "@undb/table"
import { getNextName } from "@undb/utils"
import * as z from "@undb/zod"
import type { IUpdateDashboardWidgetDTO } from "../dto/update-dashboard-widget.dto"
import { WithDashboardWidgets, type DashboardComositeSpecification } from "../specifications"

export interface IWidgetLayout {
  x: number
  y: number
  h: number
  w: number
}

export interface WidgetDataItem {
  [key: number]: IWidgetLayout
  id: string
  tableId: string | undefined
  widget: IWidgetDTO | null
}

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

  get tableId() {
    return this.props.table.id
  }

  deleteField(tableId: string, fieldId: string): Option<DashboardWidget> {
    if (this.tableId !== tableId) {
      return None
    }

    const widget = WidgetVO.fromJSON(this.props.widget)
    const updated = widget.deleteField(fieldId)
    if (updated.isNone()) {
      return None
    }

    return Some(
      new DashboardWidget({
        table: {
          id: this.props.table.id,
        },
        widget: updated.unwrap().toJSON(),
      }),
    )
  }

  deleteTable(tableId: string): Option<DashboardWidget> {
    if (this.tableId !== tableId) {
      return None
    }

    return Some(
      new DashboardWidget({
        table: {
          id: undefined,
        },
        widget: this.props.widget,
      }),
    )
  }

  /**
   * Creates a DashboardWidget instance
   * @param table Table object
   * @param dto Dashboard widget data transfer object
   * @returns DashboardWidget instance
   *
   * Note: For aggregate type widgets, if the field parameter is a field name
   * instead of an ID, this method converts it to the corresponding field ID.
   * This ensures internal consistency while allowing users to use more
   * user-friendly field names when creating widgets.
   */
  static from(table: TableDo, widget: IWidgetDTO): DashboardWidget {
    if (widget.item.type === "aggregate") {
      if (widget.item.aggregate.type === "count") {
        return new DashboardWidget({
          table: {
            id: table.id.value,
          },
          widget,
        })
      } else {
        const fieldIdOrName = widget.item.aggregate.config.field
        if (!fieldIdOrName) {
          return new DashboardWidget({
            table: {
              id: table.id.value,
            },
            widget,
          })
        }
        const fieldId = table.schema.getFieldByIdOrName(fieldIdOrName).unwrap().id.value
        return new DashboardWidget({
          table: {
            id: table.id.value,
          },
          widget: {
            ...widget,
            item: {
              ...widget.item,
              aggregate: {
                ...widget.item.aggregate,
                config: {
                  ...widget.item.aggregate.config,
                  field: fieldId,
                },
              },
            },
          },
        })
      }
    }
    return new DashboardWidget({
      table: {
        id: table.id.value,
      },
      widget,
    })
  }

  getWidget(widgetId: string): Option<IWidgetDTO> {
    if (this.props.widget.id !== widgetId) {
      return None
    }
    return Some(this.props.widget)
  }

  duplicateWidget(table: TableDo, name: string): Option<DashboardWidget> {
    const widget = WidgetVO.fromJSON(this.props.widget)
    const duplicated = widget.duplicate(name)
    return Some(
      new DashboardWidget({
        table: {
          id: table.id.value,
        },
        widget: duplicated.toJSON(),
      }),
    )
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
  static from(dtos: { table: TableDo; widget: IWidgetDTO }[]): DashboardWidgets {
    const widgets = dtos.map((dto) => DashboardWidget.from(dto.table, dto.widget))
    return new DashboardWidgets(widgets.map((w) => w.toJSON()))
  }

  $onFieldDeleted(tableId: string, fieldId: string): Option<DashboardComositeSpecification> {
    const widgets = this.value.map((w) => {
      const widget = new DashboardWidget(w)
      const updated = widget.deleteField(tableId, fieldId)
      return updated.isSome() ? updated.unwrap().toJSON() : w
    })
    const dashbaordWidgets = new DashboardWidgets(widgets)
    return Some(new WithDashboardWidgets(dashbaordWidgets))
  }

  $onTableDeleted(tableId: string): Option<DashboardComositeSpecification> {
    const widgets = this.value.map((w) => {
      const widget = new DashboardWidget(w)
      const updated = widget.deleteTable(tableId)
      return updated.isSome() ? updated.unwrap().toJSON() : w
    })
    const dashbaordWidgets = new DashboardWidgets(widgets)
    return Some(new WithDashboardWidgets(dashbaordWidgets))
  }

  get tableIds(): string[] {
    return this.value.map((w) => w.table.id).filter((tableId) => !!tableId) as string[]
  }

  addWidget(table: TableDo, dto: IDashboardWidget): DashboardWidgets {
    const value = this.value
    if (value.some((w) => w.widget.id === dto.widget.id)) {
      return new DashboardWidgets(value)
    }
    const widget = DashboardWidget.from(table, dto.widget)
    return new DashboardWidgets([...this.value, widget.toJSON()])
  }

  $addWidget(table: TableDo, dto: IDashboardWidget): DashboardComositeSpecification {
    const widgets = this.addWidget(table, dto)
    return new WithDashboardWidgets(widgets)
  }

  updateWidget(widget: IDashboardWidget): DashboardWidgets {
    const newWidget = new DashboardWidget({
      table: widget.table,
      widget: widget.widget,
    })
    return new DashboardWidgets(
      this.value.map((w) => (w.widget.id === newWidget.props.widget.id ? newWidget.toJSON() : w)),
    )
  }

  $updateWidget({ widget }: IUpdateDashboardWidgetDTO): Option<DashboardComositeSpecification> {
    const widgets = this.updateWidget(widget)
    const spec = new WithDashboardWidgets(widgets)

    return Some(spec)
  }

  deleteWidget(widgetId: string): DashboardWidgets {
    return new DashboardWidgets(this.value.filter((w) => w.widget.id !== widgetId))
  }

  $deleteWidget(widgetId: string): Option<DashboardComositeSpecification> {
    const widgets = this.deleteWidget(widgetId)
    const spec = new WithDashboardWidgets(widgets)
    return Some(spec)
  }

  getWidget(widgetId: string): Option<IDashboardWidget> {
    const widget = this.value.find((w) => w.widget.id === widgetId)
    if (!widget) {
      return None
    }
    return Some(widget)
  }

  duplicateWidget(table: TableDo, widgetId: string): DashboardWidgets {
    const widget = this.getWidget(widgetId).expect("widget not found")
    const widgets = this.props
    const widgetNames = widgets.map((w) => w.widget.name)
    const name = getNextName(widgetNames, widget.widget.name)
    const duplicated = new DashboardWidget(widget).duplicateWidget(table, name)
    return new DashboardWidgets([...this.value, duplicated.unwrap().toJSON()])
  }

  $duplicateWidget(table: TableDo, widgetId: string): Option<DashboardComositeSpecification> {
    const widget = this.getWidget(widgetId)
    if (widget.isNone()) {
      return None
    }
    const duplicated = this.duplicateWidget(table, widget.unwrap().widget.id)
    const spec = new WithDashboardWidgets(duplicated)
    return Some(spec)
  }
}
