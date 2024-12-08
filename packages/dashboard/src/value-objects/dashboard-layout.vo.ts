import { ValueObject } from "@undb/domain"
import { widgetId, type IWidgetDTO, type IWidgetType } from "@undb/table"
import { z } from "@undb/zod"
import { match } from "ts-pattern"
import { WithDashboardLayout } from "../specifications"
// @ts-ignore
import gridHelp from "svelte-grid/build/helper/index.mjs"
import type { IDashboardWidget } from "./dashboard-widgets.vo"

export const COLS = 24

export const dashboardLayoutSchema = z.object({
  x: z.number().nonnegative(),
  y: z.number().nonnegative(),
  w: z.number().nonnegative(),
  h: z.number().nonnegative(),
  min: z
    .object({
      w: z.number().nonnegative(),
      h: z.number().nonnegative(),
    })
    .optional(),
  max: z
    .object({
      w: z.number().nonnegative(),
      h: z.number().nonnegative(),
    })
    .optional(),
})

export type IDashboardLayout = z.infer<typeof dashboardLayoutSchema>

export const dashboardLayoutsSchema = z.record(widgetId, dashboardLayoutSchema).nullable()

export type IDashboardLayouts = z.infer<typeof dashboardLayoutsSchema>

export class DashboardLayouts extends ValueObject<IDashboardLayouts> {
  constructor(layouts: IDashboardLayouts) {
    super(layouts ? layouts : { value: null })
  }

  static default(): IDashboardLayout {
    return this.defaultLayout("aggregate")
  }

  static defaultSize(type: IWidgetType): { w: number; h: number; min: { w: number; h: number } } {
    return match(type)
      .with("aggregate", () => ({ w: 6, h: 2, min: { w: 4, h: 2 } }))
      .with("chart", () => ({ w: 6, h: 4, min: { w: 4, h: 2 } }))
      .with("table", () => ({ w: 6, h: 4, min: { w: 4, h: 2 } }))
      .exhaustive()
  }

  static defaultLayout(type: IWidgetType): IDashboardLayout {
    return match(type)
      .with("aggregate", () => ({
        x: 0,
        y: 0,
        w: 6,
        h: 2,
        min: {
          w: 4,
          h: 2,
        },
      }))
      .with("chart", () => ({
        x: 0,
        y: 0,
        w: 6,
        h: 4,
        min: {
          w: 4,
          h: 2,
        },
      }))
      .with("table", () => ({
        x: 0,
        y: 0,
        w: 6,
        h: 4,
        min: {
          w: 4,
          h: 2,
        },
      }))
      .exhaustive()
  }

  getLayout(widget: IWidgetDTO): IDashboardLayout {
    const layout = this.value?.[widget.id]
    if (layout) {
      return layout
    }

    return DashboardLayouts.defaultLayout(widget.item.type)
  }

  addLayout(widgetId: string, layout: IDashboardLayout): IDashboardLayouts {
    return {
      ...this.value,
      [widgetId]: layout,
    }
  }

  static getLayouts(widgets: IDashboardWidget[]): IDashboardLayouts {
    const layouts: IDashboardLayouts = {}
    const items: any[] = []
    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i]
      let position: { x: number; y: number }
      let newItem = {
        [COLS]: gridHelp.item({
          ...DashboardLayouts.defaultLayout(widget.widget.item.type),
        }),
      }
      if (i === 0) {
        position = { x: 0, y: 0 }
      } else {
        const prev = items.slice(0, i)
        const foundPosition = gridHelp.findSpace(newItem, prev, COLS)
        position = {
          x: foundPosition.x,
          y: foundPosition.y,
        }
      }

      newItem = {
        ...newItem,
        [COLS]: {
          ...newItem[COLS],
          ...position,
        },
      }

      items.push(newItem)

      const layout = {
        ...DashboardLayouts.defaultSize(widget.widget.item.type),
        ...position,
      }
      layouts[widget.widget.id] = layout
    }

    return layouts
  }

  $addWidget(widgetId: string, layout: IDashboardLayout): WithDashboardLayout {
    const layouts = this.addLayout(widgetId, layout)
    return new WithDashboardLayout(layouts)
  }

  private mergeLayouts(layouts: IDashboardLayouts): IDashboardLayouts {
    return {
      ...this.value,
      ...layouts,
    }
  }

  $relayoutWidgets(dto: IDashboardLayouts): WithDashboardLayout {
    const layout = this.mergeLayouts(dto)
    return new WithDashboardLayout(layout)
  }

  toJSON(): IDashboardLayouts {
    return this.value
  }
}
