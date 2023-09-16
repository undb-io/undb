import { FieldId, OptionKey, RecordId, TableId, ViewId, VisualizationID, WidgetID } from '@undb/core'

export class TemplateIdMapper {
  private readonly idMapper = new Map<string, string>()

  getOrCreateId(id: string, createId: () => string): string {
    let newId = this.idMapper.get(id)
    if (newId) return newId

    newId = createId()
    this.idMapper.set(id, newId)

    return newId
  }

  tableId(id: string) {
    return this.getOrCreateId(id, TableId.createId.bind(TableId))
  }

  fieldId(id: string) {
    return this.getOrCreateId(id, FieldId.createId.bind(FieldId))
  }

  recordId(id: string) {
    return this.getOrCreateId(id, RecordId.createId.bind(RecordId))
  }

  optionId(id: string) {
    return this.getOrCreateId(id, OptionKey.createId.bind(OptionKey))
  }

  viewId(id: string) {
    return this.getOrCreateId(id, ViewId.createId.bind(ViewId))
  }

  widgetId(id: string) {
    return this.getOrCreateId(id, WidgetID.createId.bind(WidgetID))
  }

  visualizationId(id: string) {
    return this.getOrCreateId(id, VisualizationID.createId.bind(VisualizationID))
  }
}
