<script lang="ts">
  import { onMount } from "svelte"
  import { EditorState } from "@codemirror/state"
  import { EditorView, keymap } from "@codemirror/view"
  import { defaultKeymap } from "@codemirror/commands"
  import { syntaxHighlighting, HighlightStyle } from "@codemirror/language"
  import { tags } from "@lezer/highlight"
  import { parseFormula } from "@undb/formula"
  import { templateVariablePlugin } from "./plugins/varaible.plugin"
  import { cn } from "$lib/utils"
  import { createParser } from "@undb/formula/src/util"
  import { FormulaCursorVisitor } from "./formula-cursor.visitor"

  let editor: EditorView
  let suggestions: string[] = []
  let selectedSuggestion: string = ""

  $: showSuggestions = suggestions.length > 0

  const functions = ["ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "SUM", "CONCAT"]
  const fields = ["field1", "field2", "field3"]

  const highlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: "#5c6bc0" },
    { tag: tags.operator, color: "#f06292" },
    { tag: tags.string, color: "#66bb6a" },
    { tag: tags.number, color: "#ff9800" },
  ])

  onMount(() => {
    const state = EditorState.create({
      doc: "",
      extensions: [
        keymap.of([
          {
            key: "ArrowUp",
            run: () => {
              if (!showSuggestions || suggestions.length === 0) return false
              const currentIndex = suggestions.findIndex((s) => s === selectedSuggestion)
              const nextIndex = currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1
              selectedSuggestion = suggestions[nextIndex]
              return true
            },
          },
          {
            key: "ArrowDown",
            run: () => {
              if (!showSuggestions || suggestions.length === 0) return false
              const currentIndex = suggestions.findIndex((s) => s === selectedSuggestion)
              const nextIndex = currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1
              selectedSuggestion = suggestions[nextIndex]
              return true
            },
          },
          {
            key: "ArrowLeft",
            run: () => {
              const cursor = editor.state.selection.main.head
              const content = editor.state.doc.toString()
              const textBeforeCursor = content.slice(0, cursor)

              // 如果光标在 }} 前面,移动到变量名前面
              if (textBeforeCursor.endsWith("}}")) {
                let i = textBeforeCursor.length - 2
                // 往前找到变量名开始位置
                while (i >= 0 && /[a-zA-Z0-9_]/.test(textBeforeCursor[i])) {
                  i--
                }
                // 跳过空格
                while (i >= 0 && textBeforeCursor[i] === " ") {
                  i--
                }
                if (i >= 0 && textBeforeCursor[i] === "{" && i > 0 && textBeforeCursor[i - 1] === "{") {
                  editor.dispatch({
                    selection: { anchor: i - 1 },
                  })
                  return true
                }
              }

              // 找到连续的 } 或 { 的第一个位置
              let i = cursor - 1
              while (i >= 0 && (textBeforeCursor[i] === "}" || textBeforeCursor[i] === "{")) {
                i--
              }

              if (i < cursor - 1) {
                editor.dispatch({
                  selection: { anchor: i },
                })
                return true
              }
              return false
            },
          },
          {
            key: "ArrowRight",
            run: () => {
              const cursor = editor.state.selection.main.head
              const content = editor.state.doc.toString()
              const textAfterCursor = content.slice(cursor)

              // 如果光标在 {{ 后面,移动到变量名后面
              if (textAfterCursor.startsWith("{{")) {
                let i = 2
                // 跳过空格
                while (i < textAfterCursor.length && textAfterCursor[i] === " ") {
                  i++
                }
                // 找到变量名结束位置
                while (i < textAfterCursor.length && /[a-zA-Z0-9_]/.test(textAfterCursor[i])) {
                  i++
                }
                if (i > 2) {
                  editor.dispatch({
                    selection: { anchor: cursor + i },
                  })
                  return true
                }
              }

              // 找到连续的 } 或 { 的最后一个位置
              let i = 0
              while (i < textAfterCursor.length && (textAfterCursor[i] === "}" || textAfterCursor[i] === "{")) {
                i++
              }

              if (i > 0) {
                editor.dispatch({
                  selection: { anchor: cursor + i },
                })
                return true
              }
              return false
            },
          },
          {
            key: "Enter",
            run: () => {
              if (selectedSuggestion) {
                insertSuggestion(selectedSuggestion)
              }
              return true
            },
          },
          ...defaultKeymap,
        ]),
        syntaxHighlighting(highlightStyle),
        templateVariablePlugin,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            updateSuggestions()
          } else if (update.selectionSet) {
            onSelectionChange()
          }
        }),
      ],
    })

    editor = new EditorView({
      state,
      parent: document.getElementById("editor-container")!,
    })
  })

  function onSelectionChange() {
    updateSuggestions()
  }

  function updateSuggestions() {
    validateFormula()

    const content = editor.state.doc.toString()

    // 获取光标位置
    const cursor = editor.state.selection.main.head
    const textBeforeCursor = content.slice(0, cursor)

    const visitor = new FormulaCursorVisitor(cursor)
    const parser = createParser(content)
    visitor.visit(parser.formula())

    const hasArgumentList = visitor.hasAggumentList()
    const hasFunctionCall = visitor.hasFunctionCall()

    // 检查是否在括号内
    const lastOpenParen = textBeforeCursor.lastIndexOf("(")
    const lastCloseParen = textBeforeCursor.lastIndexOf(")")
    const isInsideParens = lastOpenParen > lastCloseParen

    if (content.trim() === "") {
      suggestions = [...functions, ...fields]
    } else if ((hasArgumentList || isInsideParens) && hasFunctionCall) {
      suggestions = [...functions, ...fields]
    } else if (hasFunctionCall) {
      suggestions = functions
    }
  }

  function insertSuggestion(suggestion: string) {
    const cursor = editor.state.selection.main.head
    const doc = editor.state.doc.toString()
    const textBeforeCursor = doc.slice(0, cursor)

    // 检查是否在括号内
    const lastOpenParen = textBeforeCursor.lastIndexOf("(")
    const lastCloseParen = textBeforeCursor.lastIndexOf(")")
    const isInsideParens = lastOpenParen > lastCloseParen

    // 获取当前输入词的起始位置
    let insertStart
    if (isInsideParens) {
      const textInParens = textBeforeCursor.slice(lastOpenParen + 1)
      const lastWord = textInParens.split(/\s+/).pop() || ""
      insertStart = cursor - lastWord.length
    } else {
      const lastWord = doc.split(/\s+/).pop() || ""
      insertStart = doc.length - lastWord.length
    }

    if (functions.includes(suggestion)) {
      // 如果在函数名中间,只替换函数名部分
      const visitor = new FormulaCursorVisitor(cursor)
      const parser = createParser(doc)
      visitor.visit(parser.formula())

      if (!isInsideParens) {
        const functionNode = visitor.getNearestFunctionNode()
        if (functionNode) {
          const functionStart = functionNode.start.startIndex
          const functionNameLength = functionNode.IDENTIFIER().text.length
          const transaction = editor.state.update({
            changes: {
              from: functionStart,
              to: functionStart + functionNameLength,
              insert: suggestion,
            },
            selection: {
              anchor: functionStart + suggestion.length + 1,
            },
          })
          editor.dispatch(transaction)
          return
        }
      }
      const suggestionWithParens = `${suggestion}()`
      const transaction = editor.state.update({
        changes: {
          from: insertStart,
          to: cursor,
          insert: suggestionWithParens,
        },
        selection: {
          anchor: insertStart + suggestionWithParens.length - 1,
        },
      })
      editor.dispatch(transaction)
    } else {
      const fieldWithBrackets = `{{${suggestion}}}`
      const transaction = editor.state.update({
        changes: {
          from: insertStart,
          to: cursor,
          insert: fieldWithBrackets,
        },
        selection: {
          anchor: insertStart + fieldWithBrackets.length,
        },
      })
      editor.dispatch(transaction)
    }

    editor.focus()
  }

  let errorMessage: string = ""

  function validateFormula() {
    const formula = editor.state.doc.toString()
    try {
      const parsed = parseFormula(formula)
      errorMessage = ""
      return parsed
    } catch (error) {
      errorMessage = (error as Error).message
    }
  }
</script>

<div class="p-4">
  <div id="editor-container" class="mb-2 rounded-md border border-gray-300"></div>
  {#if errorMessage}
    <p class="text-destructive">{errorMessage}</p>
  {/if}

  {#if showSuggestions}
    <ul class="rounded-md border border-gray-300 bg-white shadow-lg">
      {#each suggestions as suggestion}
        {@const isSelected = suggestion === selectedSuggestion}
        <button on:click={() => insertSuggestion(suggestion)} class="w-full">
          <li class={cn("w-full cursor-pointer p-2 hover:bg-gray-100", isSelected && "bg-gray-100")}>
            {suggestion}
          </li>
        </button>
      {/each}
    </ul>
  {/if}
</div>
