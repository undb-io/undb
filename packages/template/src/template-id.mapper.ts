import { FieldId, OptionKey, TableId, ViewId, VisualizationID, WidgetID } from '@undb/core'

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
    return this.getOrCreateId(id, TableId.createId)
  }

  fieldId(id: string) {
    return this.getOrCreateId(id, FieldId.createId)
  }

  optionId(id: string) {
    return this.getOrCreateId(id, OptionKey.createId)
  }

  viewId(id: string) {
    return this.getOrCreateId(id, ViewId.createId)
  }

  widgetId(id: string) {
    return this.getOrCreateId(id, WidgetID.createId)
  }

  visualizationId(id: string) {
    return this.getOrCreateId(id, VisualizationID.createId)
  }
}
