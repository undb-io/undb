<script lang="ts">
  import { cn } from "$lib/utils"
  import type { JsonField, JsonValue } from "@undb/table"
  import { Maximize2Icon } from "lucide-svelte"
  import * as Dialog from "$lib/components/ui/dialog"
  import { type OnChange, type Content, JSONEditor, Mode } from "svelte-jsoneditor"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte"
  import { getDataService } from "$lib/store/data-service.store"

  export let tableId: string
  export let value: JsonValue | undefined = undefined
  export let isSelected: boolean
  export let field: JsonField
  export let recordId: string
  export let onValueChange: (value: JsonValue | undefined) => void

  const dataService = getDataService()

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: dataService.records.updateRecord,
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  let content: Content = {
    text: JSON.stringify(value ?? {}, null, 2),
    json: value ?? {},
  }

  const handleChange: OnChange = (updatedContent, previousContent, { contentErrors, patchResult }) => {
    content = updatedContent
    // @ts-ignore
    if (!contentErrors) value = JSON.parse(content.text)

    onValueChange(value)

    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: value },
    })
  }

  let open = false
  function onDbClick() {
    if (!isSelected) {
      return
    }

    open = true
  }
</script>

<!-- svelte-ignore a11y-interactive-supports-focus -->
<div
  role="button"
  on:dblclick={onDbClick}
  class={cn($$restProps.class, "flex justify-between", !value && "justify-end")}
>
  <div class="truncate">
    {#if value}
      <span>{JSON.stringify(value)}</span>
    {/if}
  </div>

  {#if isSelected}
    <Dialog.Root
      bind:open
      onOpenChange={(open) => {
        if (!open) {
        }
      }}
    >
      <Dialog.Trigger>
        <button>
          <Maximize2Icon class="text-muted-foreground h-3 w-3" />
        </button>
      </Dialog.Trigger>
      <Dialog.Content class="max-h-[calc(100vh-40px)] max-w-3xl overflow-y-auto p-2 md:w-[700px]">
        <JSONEditor
          {content}
          onChange={handleChange}
          mode={Mode.text}
          mainMenuBar={false}
          navigationBar={false}
          statusBar={false}
          askToFormat={false}
        />
      </Dialog.Content>
    </Dialog.Root>
  {/if}
</div>
