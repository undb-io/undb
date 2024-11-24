<script lang="ts">
  import type { JsonValue as Json, JsonField } from "@undb/table"
  import { JSONEditor, Mode, type Content, type OnChange } from "svelte-jsoneditor"
  export let value: Json | undefined = undefined
  export let field: JsonField
  export let readonly = false
  export let onValueChange: (value: Json) => void

  let content: Content = {
    text: JSON.stringify(value ?? {}, null, 2),
    json: value ?? {},
  }

  const handleChange: OnChange = (updatedContent, previousContent, { contentErrors, patchResult }) => {
    content = updatedContent
    if (!contentErrors) {
      // @ts-ignore
      value = JSON.parse(content.text)
      onValueChange?.(value)
    }
  }
</script>

<JSONEditor
  {content}
  readOnly={readonly ? true : undefined}
  onChange={handleChange}
  mode={Mode.text}
  mainMenuBar={false}
  navigationBar={false}
  statusBar={false}
  askToFormat={false}
/>
