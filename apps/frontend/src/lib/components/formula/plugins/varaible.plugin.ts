import { StateField } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView, WidgetType } from "@codemirror/view"
import { variable } from "../style"

// 创建两个装饰器：一个用于整个变量区域，一个用于隐藏花括号
const variableMark = Decoration.mark({
  class: variable(),
})

// 用于隐藏花括号的装饰器
const hideBrackets = Decoration.replace({
  widget: new (class extends WidgetType {
    toDOM() {
      return document.createElement("span")
    }
  })(),
})

const variableField = StateField.define<DecorationSet>({
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

      // 按顺序添加装饰器：
      // 1. 首先添加整体变量区域的装饰
      matches.push(variableMark.range(start, end))
      // 2. 然后添加开始花括号的隐藏装饰
      matches.push(hideBrackets.range(start, start + 2))
      // 3. 最后添加结束花括号的隐藏装饰
      matches.push(hideBrackets.range(end - 2, end))
    }

    // 确保装饰器按照 from 位置排序
    matches.sort((a, b) => a.from - b.from)

    return Decoration.set(matches, true) // 添加 true 参数表示已排序
  },
  provide: (f) => EditorView.decorations.from(f),
})

export const templateVariablePlugin = [variableField]
