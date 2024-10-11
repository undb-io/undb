import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { tableId } from "../../table-id.vo"
import { aggregate } from "../aggregate/aggregate.vo"
import { chart } from "../chart/chart.vo"
import { widgetId, WidgetIdVo } from "./widget-id.vo"
import { widgetName } from "./widget-name.vo"

const widgetItemAggregate = z.object({
  type: z.literal("aggregate"),
  aggregate: aggregate,
})

const widgetItemChart = z.object({
  type: z.literal("chart"),
  chart: chart,
})

const widgetItemTable = z.object({
  type: z.literal("table"),
  tableId: tableId,
})

const widgetItem = z.discriminatedUnion("type", [widgetItemAggregate, widgetItemChart, widgetItemTable])

export const widgetDTO = z.object({
  id: widgetId,
  name: widgetName,
  item: widgetItem,
})

export type IWidgetDTO = z.infer<typeof widgetDTO>

export class WidgetVO extends ValueObject<IWidgetDTO> {
  static default(name = "Count") {
    return new WidgetVO({
      id: WidgetIdVo.create().value,
      name: widgetName.parse(name),
      item: {
        type: "aggregate",
        aggregate: {
          type: "count",
        },
      },
    })
  }
  public get id() {
    return this.props.id
  }

  public get name() {
    return this.props.name
  }

  public get item() {
    return this.props.item
  }

  public toJSON(): IWidgetDTO {
    return {
      id: this.props.id,
      name: this.props.name,
      item: this.props.item,
    }
  }
}
