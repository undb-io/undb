<script lang="ts">
  import type { JsonValue as Json, JsonField } from "@undb/table"
  import { JSONEditor, Mode, type Content, type OnChange } from "svelte-jsoneditor"
  export let value: Json | undefined = undefined
  export let field: JsonField
  export let readonly = false

  let content: Content = {
    text: "{}",
    json: value ?? {},
  }

  const handleChange: OnChange = (updatedContent, previousContent, { contentErrors, patchResult }) => {
    content = updatedContent
    // @ts-ignore
    if (!contentErrors) value = JSON.parse(content.text)
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
