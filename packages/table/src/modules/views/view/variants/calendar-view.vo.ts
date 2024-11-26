import { None, Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { IDuplicateViewDTO } from "../../../../dto/duplicate-view.dto"
import { WithNewView, WithView } from "../../../../specifications/table-view.specification"
import type { TableDo } from "../../../../table.do"
import { fieldId } from "../../../schema/fields/field-id.vo"
import { ViewIdVo } from "../view-id.vo"
import { AbstractView, baseViewDTO, createBaseViewDTO, updateBaseViewDTO } from "./abstract-view.vo"

export const CALENDAR_TYPE = "calendar" as const

export const calendarTimeScale = z.enum(["day", "week", "month"])
export type CalendarTimeScale = z.infer<typeof calendarTimeScale>

export const calendarTimeScales = ["day", "week", "month"] as const

export const calendarOption = z.object({
  field: fieldId.optional(),
  timeScale: calendarTimeScale.optional(),
})

export type ICalendarOption = z.infer<typeof calendarOption>

export const createCalendarViewDTO = createBaseViewDTO.extend({
  type: z.literal(CALENDAR_TYPE),
  calendar: calendarOption.optional(),
})

export type ICreateCalendarViewDTO = z.infer<typeof createCalendarViewDTO>

export const calendarViewDTO = baseViewDTO.extend({
  type: z.literal(CALENDAR_TYPE),
  calendar: calendarOption.optional(),
})

export type ICalendarViewDTO = z.infer<typeof calendarViewDTO>

export const updateCalendarViewDTO = updateBaseViewDTO.merge(
  z.object({
    type: z.literal(CALENDAR_TYPE),
    calendar: calendarOption.optional(),
  }),
)

export type IUpdateCalendarViewDTO = z.infer<typeof updateCalendarViewDTO>

export type MonthScope = "selectedDate" | "withoutDate" | "thisMonth" | "allRecords"
export type WeekScope = "selectedWeek" | "thisWeek" | "allRecords"
export type DayScope = "selectedDate" | "withoutDate" | "allRecords"
export type Scope = MonthScope | WeekScope | DayScope

const baseScope: Scope[] = ["selectedDate", "withoutDate", "allRecords"]

const scopesMap: Record<CalendarTimeScale, Scope[]> = {
  day: baseScope,
  week: ["thisWeek", ...baseScope],
  month: [...baseScope, "thisMonth"],
} as const

export class CalendarView extends AbstractView {
  calendar: Option<ICalendarOption> = None

  get field() {
    return this.calendar.map((x) => x.field)
  }

  get timeScale() {
    return this.calendar.map((x) => x.timeScale ?? "month").unwrapOr("month")
  }

  set timeScale(timeScale: CalendarTimeScale) {
    this.calendar = this.calendar.map((x) => ({ ...x, timeScale }))
  }

  get scopes() {
    return scopesMap[this.timeScale]
  }

  constructor(table: TableDo, dto: ICalendarViewDTO) {
    super(table, dto)
    this.calendar = Option(dto.calendar)
  }

  static create(table: TableDo, dto: ICreateCalendarViewDTO) {
    const fields = table.getOrderedFields()
    return new CalendarView(table, {
      ...dto,
      id: ViewIdVo.fromStringOrCreate(dto.id).value,
      fields: fields.map((f, index) => ({ fieldId: f.id.value, hidden: index > 5 })),
    })
  }

  override type = CALENDAR_TYPE

  override $update(table: TableDo, input: IUpdateCalendarViewDTO): Option<WithView> {
    const json = this.toJSON()
    const view = new CalendarView(table, {
      ...json,
      name: input.name,
      id: this.id.value,
      type: CALENDAR_TYPE,
      calendar: input.calendar ?? this.calendar.into(undefined),
    })

    return Some(new WithView(this, view))
  }

  override $duplicate(table: TableDo, dto: IDuplicateViewDTO): Option<WithNewView> {
    const json = this.toJSON()

    return Some(
      new WithNewView(
        new CalendarView(table, {
          ...json,
          name: dto.name,
          calendar: this.calendar.into(undefined),
          isDefault: false,
          id: ViewIdVo.create().value,
          type: CALENDAR_TYPE,
        }),
      ),
    )
  }

  toJSON() {
    return { ...super.toJSON(), calendar: this.calendar.into(undefined) }
  }
}
