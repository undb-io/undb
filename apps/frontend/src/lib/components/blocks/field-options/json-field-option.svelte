<script lang="ts">
  import type { JsonValue as Json } from "@undb/table"
  import { JSONEditor, Mode, type Content, type OnChange } from "svelte-jsoneditor"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Separator } from "$lib/components/ui/separator"
  import type { IJsonFieldConstraint } from "@undb/table"
  import { LL } from "@undb/i18n/client"

  export let constraint: IJsonFieldConstraint | undefined = { required: false }
  export let defaultValue: Json | undefined
  export let disabled: boolean | undefined

  let content: Content = {
    text: undefined,
    json: defaultValue ?? {},
  }

  const handleChange: OnChange = (updatedContent, previousContent, { contentErrors, patchResult }) => {
    content = updatedContent
    // @ts-ignore
    if (!contentErrors) defaultValue = JSON.parse(content.text)
  }
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label for="defaultValue" class="text-xs font-normal">{$LL.table.field.defaultValue.label()}</Label>
    <JSONEditor
      readOnly={disabled}
      {content}
      onChange={handleChange}
      mode={Mode.text}
      mainMenuBar={false}
      navigationBar={false}
      statusBar={false}
      askToFormat={false}
    />
  </div>
  {#if constraint}
    <div class="pt-2">
      <Separator />
    </div>

    <div class="flex items-center space-x-2 pt-2">
      <Checkbox {disabled} id="required" bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">{$LL.table.field.defaultValue.markAsRequired()}</Label>
    </div>
  {/if}
</div>
