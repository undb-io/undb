import { StateField } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView, WidgetType } from "@codemirror/view"
import { TableDo } from "@undb/table"
import { variable } from "../style"

const variableField = (table: TableDo) =>
  StateField.define<DecorationSet>({
    create() {
      return Decoration.none
    },
    update(decorations, tr) {
      decorations = decorations.map(tr.changes)

      let matches = []
      let content = tr.state.doc.toString()
      const regex = /\{\{([^}]+)\}\}/g
      let match

      while ((match = regex.exec(content)) !== null) {
        const start = match.index
        const end = match.index + match[0].length
        const fieldId = match[1].trim()
        const field = table.schema.getFieldByIdOrName(fieldId).into(null)
        if (!field) continue

        // 创建替换文本装饰器
        const fieldName = field.name.value
        matches.push(
          Decoration.replace({
            widget: new (class extends WidgetType {
              toDOM() {
                const span = document.createElement("span")
                span.textContent = fieldName
                span.className = variable()
                return span
              }
            })(),
          }).range(start, end),
        )
      }

      // 确保装饰器按照 from 位置排序
      matches.sort((a, b) => a.from - b.from)

      return Decoration.set(matches, true)
    },
    provide: (f) => EditorView.decorations.from(f),
  })

export const templateVariablePlugin = (table: TableDo) => [variableField(table)]
