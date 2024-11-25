<script lang="ts">
  import { onMount } from "svelte"
  import Fuse from "fuse.js"
  import { EditorState } from "@codemirror/state"
  import { EditorView, keymap } from "@codemirror/view"
  import { defaultKeymap } from "@codemirror/commands"
  import { syntaxHighlighting, HighlightStyle } from "@codemirror/language"
  import { tags } from "@lezer/highlight"
  import { CharStreams, FormulaLexer, type FormulaFunction } from "@undb/formula"
  import { templateVariablePlugin } from "./plugins/varaible.plugin"
  import { cn } from "$lib/utils"
  import { createParser } from "@undb/formula/src/util"
  import { FormulaCursorVisitor } from "./formula-cursor.visitor"
  import { FORMULA_FUNCTIONS } from "@undb/formula"
  import { SquareFunctionIcon, TriangleAlertIcon } from "lucide-svelte"
  import { getTable } from "$lib/store/table.store"
  import { derived } from "svelte/store"
  import FieldIcon from "../blocks/field-icon/field-icon.svelte"
  import { computePosition, flip, shift, offset } from "@floating-ui/dom"
  import { globalFormulaRegistry } from "@undb/formula/src/formula/formula.registry"
  import { getReturnTypeFromExpressionResult, parseFormula, type FormulaField } from "@undb/table"
  import Label from "../ui/label/label.svelte"
  import { LL } from "@undb/i18n/client"

  const functions = FORMULA_FUNCTIONS

  export let field: FormulaField | undefined = undefined
  let returnType = field?.returnType

  const table = getTable()
  let fields = derived(table, ($table) =>
    $table.schema.fields
      .filter((field) => !field.isSystem)
      .filter((f) => f.id.value !== field?.id.value)
      .filter((f) => f.type !== "dateRange" && f.type !== "button")
      .map((field) => field.id.value),
  )
  export let value: string = ""

  let editor: EditorView
  let formulaSuggestions: string[] = []
  let fieldSuggestions: string[] = []

  function initSuggestions() {
    formulaSuggestions = [...functions]
    fieldSuggestions = [...$fields]
  }

  onMount(() => {
    initSuggestions()
  })

  $: suggestions = [...formulaSuggestions, ...fieldSuggestions]

  let selectedSuggestion: string = ""
  let hoverSuggestion: string = ""

  $: hoverFormula = hoverSuggestion ? globalFormulaRegistry.get(hoverSuggestion as FormulaFunction) : undefined

  const highlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: "#5c6bc0" },
    { tag: tags.operator, color: "#f06292" },
    { tag: tags.string, color: "#66bb6a" },
    { tag: tags.number, color: "#ff9800" },
  ])

  onMount(() => {
    const state = EditorState.create({
      doc: value,
      extensions: [
        keymap.of([
          {
            key: "ArrowUp",
            run: () => {
              if (suggestions.length === 0) return false
              const currentIndex = suggestions.findIndex((s) => s === selectedSuggestion)
              const nextIndex = currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1
              selectedSuggestion = suggestions[nextIndex]
              return true
            },
          },
          {
            key: "ArrowDown",
            run: () => {
              if (suggestions.length === 0) return false
              const currentIndex = suggestions.findIndex((s) => s === selectedSuggestion)
              const nextIndex = currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1
              selectedSuggestion = suggestions[nextIndex]
              return true
            },
          },
          {
            key: "ArrowLeft",
            run: (editor) => {
              const cursor = editor.state.selection.main.head
              const content = editor.state.doc.toString()
              const textBeforeCursor = content.slice(0, cursor)

              // 如果光标在 }} 前面,移动到变量名前面
              if (textBeforeCursor.endsWith("}}")) {
                let i = 2
                // 跳过空格
                while (i < textBeforeCursor.length && textBeforeCursor[textBeforeCursor.length - i - 1] === " ") {
                  i++
                }
                // 找到变量名开始位置
                while (
                  i < textBeforeCursor.length &&
                  /[a-zA-Z0-9_]/.test(textBeforeCursor[textBeforeCursor.length - i - 1])
                ) {
                  i++
                }
                if (i > 2) {
                  editor.dispatch({
                    selection: { anchor: cursor - i },
                  })
                  return true
                }
              }

              // 找到连续的 } 或 { 的第一个位置
              let i = 0
              while (
                i < textBeforeCursor.length &&
                (textBeforeCursor[textBeforeCursor.length - i - 1] === "}" ||
                  textBeforeCursor[textBeforeCursor.length - i - 1] === "{")
              ) {
                i++
              }

              if (i > 0) {
                editor.dispatch({
                  selection: { anchor: cursor - i },
                })
                return true
              }
              return false
            },
          },
          {
            key: "ArrowRight",
            run: (editor) => {
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
          {
            key: "Backspace",
            run: (editor) => {
              const cursor = editor.state.selection.main.head
              const content = editor.state.doc.toString()
              const textBeforeCursor = content.slice(0, cursor)
              const textAfterCursor = content.slice(cursor)

              // 检查是否在变量内部或者最后一个 } 后面
              const lastOpenBrace = textBeforeCursor.lastIndexOf("{{")
              if (lastOpenBrace !== -1) {
                const nextCloseBrace = content.indexOf("}}", lastOpenBrace)
                if (nextCloseBrace !== -1 && cursor <= nextCloseBrace + 2 && cursor > lastOpenBrace) {
                  // 删除整个变量
                  editor.dispatch({
                    changes: {
                      from: lastOpenBrace,
                      to: nextCloseBrace + 2,
                      insert: "",
                    },
                  })
                  return true
                }
              }
              return false
            },
          },
          ...defaultKeymap,
        ]),
        syntaxHighlighting(highlightStyle),
        templateVariablePlugin($table),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          const formula = editor.state.doc.toString()
          value = formula

          if (update.docChanged) {
            updateSuggestions(true)
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

    editor.focus()
  })

  function onSelectionChange() {
    updateSuggestions()
  }

  let suggestionsList: HTMLUListElement

  function updateSuggestions(updated = false) {
    validateFormula()

    if (!updated) {
      suggestionsList.scrollTop = 0
      initSuggestions()
      return
    }

    const content = editor.state.doc.toString()

    // 获取光标位置
    const cursor = editor.state.selection.main.head

    const inputStream = CharStreams.fromString(content)
    const lexer = new FormulaLexer(inputStream)
    const allTokens = lexer.getAllTokens()

    let searchValue = ""
    for (const token of allTokens) {
      const startIndex = token.start
      const stopIndex = token.stop
      if (cursor - 1 >= startIndex && cursor - 1 <= stopIndex) {
        if (token.type === FormulaLexer.IDENTIFIER) {
          searchValue = token.text
          break
        }

        if (token.type === FormulaLexer.LBRACE) {
          formulaSuggestions = []
          fieldSuggestions = [...$fields]
          // 如果光标在括号内,则不进行搜索, 直接使用 fields
          return
        }
      }
    }

    if (!searchValue) {
      initSuggestions()
      return
    }

    const formulaFuse = new Fuse(formulaSuggestions)
    formulaSuggestions = formulaFuse.search(searchValue).map((result) => result.item)
    const fieldFuse = new Fuse(fieldSuggestions)
    fieldSuggestions = fieldFuse.search(searchValue).map((result) => result.item)

    suggestionsList.scrollTop = 0
  }

  function insertSuggestion(suggestion: string) {
    let cursor = editor.state.selection.main.head
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

    if (functions.includes(suggestion as FormulaFunction)) {
      // 如果在函数名中间,只替换函数名部分
      const visitor = new FormulaCursorVisitor(cursor)
      const parser = createParser(doc)
      visitor.visit(parser.formula())

      if (!isInsideParens) {
        const functionNode = visitor.getNearestFunctionNode()
        if (functionNode) {
          const functionStart = functionNode.start.tokenIndex
          const functionNameLength = functionNode.IDENTIFIER().getText().length
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
          anchor: insertStart + suggestion.length + 1,
        },
      })
      editor.dispatch(transaction)
    } else {
      const fieldWithBrackets = `{{${suggestion}}}`
      const fullText = editor.state.doc.toString()

      // 检查光标是否在变量内部
      let isInsideVariable = false
      let variableStart = -1
      let variableEnd = -1

      // 向前搜索 {{
      for (let i = cursor; i >= 0; i--) {
        if (fullText.slice(i, i + 2) === "{{") {
          variableStart = i
          break
        }
      }

      // 向后搜索 }}
      for (let i = cursor; i < fullText.length; i++) {
        if (fullText.slice(i, i + 2) === "}}") {
          variableEnd = i + 2
          break
        }
      }

      // 判断光标是否在变量内部
      if (variableStart !== -1 && variableEnd !== -1) {
        const textBetween = fullText.slice(variableStart, variableEnd)
        isInsideVariable = textBetween.includes("{{") && textBetween.includes("}}") && !textBetween.includes(",")
      }

      // 如果光标在变量内部，替换变量
      // 如果光标在变量后面或其他位置，直接在当前位置插入
      if (isInsideVariable && cursor < variableEnd) {
        const transaction = editor.state.update({
          changes: {
            from: variableStart,
            to: variableEnd,
            insert: fieldWithBrackets,
          },
          selection: {
            anchor: variableStart + fieldWithBrackets.length,
          },
        })
        editor.dispatch(transaction)
      } else {
        const transaction = editor.state.update({
          changes: {
            from: cursor,
            to: cursor,
            insert: fieldWithBrackets,
          },
          selection: {
            anchor: cursor + fieldWithBrackets.length,
          },
        })
        editor.dispatch(transaction)
      }
    }
    editor.focus()
  }

  let errorMessage: string = ""

  function validateFormula() {
    const formula = editor.state.doc.toString()
    try {
      const parsed = parseFormula($table, formula)
      returnType = getReturnTypeFromExpressionResult(parsed)
      errorMessage = ""
      return parsed
    } catch (error) {
      console.error(error)
      errorMessage = (error as Error).message
    }
  }

  let hoverSuggestionContainer: HTMLElement
  let editorContainerWrapper: HTMLElement

  function update() {
    if (hoverSuggestionContainer && editorContainerWrapper && hoverFormula) {
      computePosition(editorContainerWrapper, hoverSuggestionContainer, {
        placement: "left-start",
        middleware: [flip(), shift({ padding: 5 }), offset(10)],
      }).then(({ x, y }) => {
        Object.assign(hoverSuggestionContainer.style, {
          left: `${x}px`,
          top: `${y}px`,
        })
      })
    }
  }

  onMount(() => {
    update()
  })
</script>

<div class="flex items-center justify-between space-y-1">
  <Label for="Formula" class="text-xs font-normal">{$LL.table.field.formula.label()}</Label>

  {#if returnType}
    <span
      class="me-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium uppercase text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    >
      {returnType}
    </span>
  {/if}
</div>
<div bind:this={editorContainerWrapper} id="editor-container-wrapper" class="relative">
  <div id="editor-container" class="mb-2 rounded-sm border"></div>
  {#if errorMessage}
    <p class="text-destructive flex items-start gap-1 text-xs">
      <TriangleAlertIcon class="size-3" />
      <span class="flex-1">{errorMessage}</span>
    </p>
  {/if}

  <ul
    class="mt-2 flex h-[250px] flex-col divide-y overflow-auto rounded-lg border border-gray-200"
    bind:this={suggestionsList}
  >
    <div class="sticky top-0 z-10 border-b bg-gray-100 px-2 py-1.5 text-xs font-semibold">
      {$LL.table.field.formula.label()}
    </div>
    {#each formulaSuggestions as suggestion}
      {@const isSelected = suggestion === selectedSuggestion}
      {@const isHovered = suggestion === hoverSuggestion}
      <button
        type="button"
        on:click={() => insertSuggestion(suggestion)}
        on:mouseenter={() => {
          hoverSuggestion = suggestion
          update()
        }}
        class="group relative w-full text-left text-xs font-medium"
      >
        <li
          class={cn("flex w-full items-center gap-1 p-2 hover:bg-gray-100", (isSelected || isHovered) && "bg-gray-100")}
        >
          <span class="font-normal">
            <SquareFunctionIcon class="size-4" />
          </span>
          <span>
            {suggestion}()
          </span>
        </li>

        <div class="absolute left-0 top-0 z-50 -translate-x-[100%] group-hover:block">hello</div>
      </button>
    {/each}
    <div class="sticky top-0 z-10 border-b bg-gray-100 px-2 py-1.5 text-xs font-semibold">
      {$LL.table.field.fields()}
    </div>
    {#each fieldSuggestions as suggestion}
      {@const isSelected = suggestion === selectedSuggestion}
      {@const field = $table.schema.getFieldByIdOrName(suggestion).into(null)}
      <button
        type="button"
        on:mouseenter={() => {
          hoverSuggestion = ""
        }}
        on:click={() => insertSuggestion(suggestion)}
        class="w-full text-left text-xs font-medium"
      >
        <li class={cn("flex w-full items-center gap-1 p-2 hover:bg-gray-100", isSelected && "bg-gray-100")}>
          {#if field}
            <span class="flex items-center gap-1">
              <FieldIcon class="size-4" type={field.type} {field} />
              {field.name.value}
            </span>
          {/if}
        </li>
      </button>
    {/each}
  </ul>

  <div bind:this={hoverSuggestionContainer} class="fixed left-0 top-0 w-80 rounded-md border bg-white shadow-md">
    {#if hoverFormula}
      <div class="flex items-center justify-between border-b bg-gray-100 px-2 py-1">
        <div class="flex items-center gap-2 text-sm">
          <SquareFunctionIcon class="size-4" />
          {hoverSuggestion}()
        </div>

        {#if hoverFormula.returnType}
          <span
            class="me-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium uppercase text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            {hoverFormula.returnType}
          </span>
        {/if}
      </div>

      <div class="space-y-2 p-2">
        <p class="overflow-hidden whitespace-normal break-words text-xs text-gray-500">{hoverFormula.description}</p>
        <div class="space-y-2">
          <p class="text-xs font-semibold text-gray-500">{$LL.table.field.formula.syntax()}</p>
          {#each hoverFormula.syntax as syntax}
            <div class="whitespace-normal break-words rounded-sm border px-2 py-1 text-xs leading-6 text-gray-800">
              {syntax}
            </div>
          {/each}
        </div>
        {#if hoverFormula.examples && hoverFormula.examples.length > 0}
          <p class="text-xs font-semibold text-gray-500">{$LL.table.field.formula.examples()}</p>
          <div class="space-y-2">
            {#each hoverFormula.examples as example}
              <div class="whitespace-normal break-words rounded-sm border px-2 py-1 text-xs leading-6 text-gray-800">
                {example[0]}
                {#if example[1] !== undefined}
                  <span class="text-gray-500">
                    => {example[1]}
                  </span>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  :global(.cm-focused) {
    @apply rounded-sm !outline !outline-2 !outline-offset-2 !outline-blue-500/70;
  }

  :global(.cm-content) {
    @apply py-2 text-xs;
  }
</style>
