import type { IFilter, IFilterOrGroup } from '@undb/core'
import { isFilter, isGroup } from '@undb/core'
import { isString, keyBy, mapKeys, transform } from 'lodash-es'
import { P, match } from 'ts-pattern'
import { TemplateIdMapper } from './template-id.mapper'
import type { ITemplateSchema } from './template.schema'

export class TemplateIdVisitor {
  private readonly mapper = new TemplateIdMapper()

  public visit(template: ITemplateSchema): ITemplateSchema {
    for (const table of template.export.tables) {
      table.id = this.mapper.tableId(table.id)
      field: for (const field of table.schema) {
        if (!field.id) continue field

        field.id = this.mapper.fieldId(field.id)

        if (field.type === 'select') {
          option: for (const option of field.options) {
            if (!option.key) continue option
            option.key = this.mapper.optionId(option.key)
          }
        }
        if (field.type === 'reference') {
          if (field.foreignTableId) {
            field.foreignTableId = this.mapper.tableId(field.foreignTableId)
          }
        }
        if (field.type === 'reference' || field.type === 'lookup' || field.type === 'tree' || field.type === 'parent') {
          if (field.displayFieldIds) {
            field.displayFieldIds = field.displayFieldIds.map((id) => this.mapper.fieldId(id))
          }
        }
        if (
          field.type === 'min' ||
          field.type === 'lookup' ||
          field.type === 'max' ||
          field.type === 'sum' ||
          field.type === 'average' ||
          field.type === 'count'
        ) {
          field.referenceFieldId = this.mapper.fieldId(field.referenceFieldId)
        }
        if (field.type === 'min' || field.type === 'max' || field.type === 'sum' || field.type === 'average') {
          field.aggregateFieldId = this.mapper.fieldId(field.aggregateFieldId)
        }

        if (field.type === 'tree') {
          if (field.parentFieldId) {
            field.parentFieldId = this.mapper.fieldId(field.parentFieldId)
          }
        }

        if (field.type === 'parent') {
          field.treeFieldId = this.mapper.fieldId(field.treeFieldId)
        }
      }

      for (const view of table.views ?? []) {
        if (view.id) {
          view.id = this.mapper.viewId(view.id)
        }

        if (view.fieldOptions) {
          view.fieldOptions = mapKeys(view.fieldOptions, (_, fieldId) => this.mapper.fieldId(fieldId))
        }
        if (view.calendar?.fieldId) {
          view.calendar.fieldId = this.mapper.fieldId(view.calendar.fieldId)
        }
        if (view.kanban?.fieldId) {
          view.kanban.fieldId = this.mapper.fieldId(view.kanban.fieldId)
        }
        if (view.tree?.fieldId) {
          view.tree.fieldId = this.mapper.fieldId(view.tree.fieldId)
        }
        if (view.gallery?.fieldId) {
          view.gallery.fieldId = this.mapper.fieldId(view.gallery.fieldId)
        }
        if (view.gantt?.fieldId) {
          view.gantt.fieldId = this.mapper.fieldId(view.gantt.fieldId)
        }
        if (view.sorts) {
          view.sorts = view.sorts.map((s) => ({ ...s, fieldId: this.mapper.fieldId(s.fieldId) }))
        }
        if (view.fieldsOrder) {
          view.fieldsOrder = view.fieldsOrder.map((id) => this.mapper.fieldId(id))
        }
        if (view.filter) {
          if (Array.isArray(view.filter)) {
            for (const filter of view.filter) {
              this.visitFilter(filter)
            }
          } else {
            this.visitFilter(view.filter)
          }
        }
        if (view.pinnedFields) {
          view.pinnedFields = {
            left: view.pinnedFields.left.map((f) => this.mapper.fieldId(f)),
            right: view.pinnedFields.right.map((f) => this.mapper.fieldId(f)),
          }
        }
        if (view.dashboard?.widgets) {
          for (const widget of view.dashboard.widgets) {
            if (widget.id) {
              widget.id = this.mapper.widgetId(widget.id)
              if (widget.visualization) {
                if (widget.visualization.fieldId) {
                  widget.visualization.fieldId = this.mapper.fieldId(widget.visualization.fieldId)
                }
                if (widget.visualization.id) {
                  widget.visualization.id = this.mapper.visualizationId(widget.visualization.id)
                }
              }
            }
          }
        }
      }

      if (table.viewsOrder) {
        table.viewsOrder = table.viewsOrder.map((id) => this.mapper.viewId(id))
      }

      const schema = keyBy(table.schema, 'id')
      if (table.records) {
        for (const record of table.records) {
          record.id = this.mapper.recordId(record.id)
          record.values = transform(record.values, (result, value, fieldId) => {
            const newFieldId = this.mapper.fieldId(fieldId)
            if (!newFieldId) return

            const field = schema[newFieldId]
            if (!field) return

            const newValue = match(field)
              .with(
                { type: 'attachment' },
                { type: 'collaborator' },
                { type: 'reference', foreignTableId: P.when((id) => id !== table.id) },
                () => null,
              )
              .with(
                { type: 'tree' },
                { type: 'reference', foreignTableId: P.when((id) => id === table.id) },
                () => (value as string[] | null)?.map((id) => this.mapper.recordId(id)) ?? null,
              )
              .with(
                { type: 'multi-select' },
                () => (value as string[] | undefined)?.map((id) => this.mapper.optionId(id)) ?? null,
              )
              .with({ type: 'select' }, () => (isString(value) ? this.mapper.optionId(value) : null))
              .with({ type: 'parent' }, () => {
                if (isString(value)) return this.mapper.recordId(value)
                return null
              })
              .otherwise(() => value)

            result[newFieldId] = newValue
          })
        }
      }
    }

    return template
  }

  private visitFilterItem(filter: IFilter) {
    filter.path = this.mapper.fieldId(filter.path)
    if (filter.type === 'select') {
      if (Array.isArray(filter.value)) {
        filter.value = filter.value.filter(Boolean).map((optionId) => this.mapper.optionId(optionId!))
      } else if (isString(filter.value)) {
        filter.value = this.mapper.optionId(filter.value)
      }
    }
  }

  private visitFilter(filter: IFilterOrGroup) {
    if (isFilter(filter)) {
      this.visitFilterItem(filter)
    } else if (isGroup(filter)) {
      for (const f of filter.children ?? []) {
        this.visitFilter(f)
      }
    }
  }
}
