import type { Dashboard } from "@undb/dashboard"
import { WidgetIdVo, type IWidgetDTO, type IWidgetType } from "@undb/table"
import { writable } from "svelte/store"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gridHelp from "svelte-grid/build/helper/index.mjs"

export const COLS = 24

export interface WidgetDataItem {
  [key: number]: {
    x: number
    y: number
    h: number
    w: number
  }
  id: string
  tableId: string | undefined
  widget: IWidgetDTO | null
}

export const createWidgetItems = (dashboard: Dashboard) => {
  const { subscribe, set, update } = writable<WidgetDataItem[]>([])
  let $widgetItems: WidgetDataItem[] = []

  function init() {
    const widgets = dashboard.widgets.value
    set(
      widgets.map((widget) => ({
        [COLS]: gridHelp.item({
          ...dashboard.layout.getLayout(widget.widget),
          customDragger: true,
          customResizer: true,
        }),
        id: widget.widget.id,
        tableId: widget.table.id,
        widget: widget.widget as IWidgetDTO | null,
      })) ?? [],
    )
  }

  function add(type: IWidgetType) {
    const id = WidgetIdVo.create().value
    let newItem: WidgetDataItem = {
      [COLS]: gridHelp.item({
        ...[type],
        customDragger: true,
        customResizer: true,
      }),
      id,
      tableId: undefined,
      widget: null,
    }

    const findOutPosition = gridHelp.findSpace(newItem, $widgetItems, COLS)

    newItem = {
      ...newItem,
      [COLS]: {
        ...newItem[COLS],
        ...findOutPosition,
      },
    }

    update(($widgetItems) => [...$widgetItems, ...[newItem]])

    return newItem
  }

  function remove(id: string) {
    const widgetItems = $widgetItems.filter((w) => w.widget?.id !== id)
    $widgetItems = widgetItems
    $widgetItems = gridHelp.adjust(widgetItems, COLS)
    return $widgetItems
  }

  init()

  subscribe((items) => {
    $widgetItems = items
  })

  return {
    subscribe,
    set,
    update,
    init,
    add,
    remove,
  }
}

export const cols = [[1200, COLS]]

export type WidgetItemsStore = ReturnType<typeof createWidgetItems>
