<script lang="ts">
  import type { JsonField, JsonValue } from "@undb/table"
  import { type OnChange, type Content, JSONEditor, Mode } from "svelte-jsoneditor"
  import * as Popover from "$lib/components/ui/popover"
  import { Button } from "$lib/components/ui/button"
  import { cn } from "$lib/utils"

  export let value: JsonValue | undefined = undefined
  export let field: JsonField
  export let disabled = false

  let content: Content = {
    text: undefined,
    json: value ?? {},
  }

  const handleChange: OnChange = (updatedContent, previousContent, { contentErrors, patchResult }) => {
    content = updatedContent
    // @ts-ignore
    if (!contentErrors) value = JSON.parse(content.text)
  }
</script>

<Popover.Root>
  <Popover.Trigger asChild let:builder>
    <Button
      {disabled}
      variant="outline"
      builders={[builder]}
      class={cn("w-full justify-start truncate", $$restProps.class)}
    >
      {#if value}
        <span>{JSON.stringify(value)}</span>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content>
    <JSONEditor
      {content}
      onChange={handleChange}
      mode={Mode.text}
      mainMenuBar={false}
      navigationBar={false}
      statusBar={false}
      askToFormat={false}
    />
  </Popover.Content>
</Popover.Root>
