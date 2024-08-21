<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import type { LongTextField, StringField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { gridViewStore } from "../grid-view.store"

  export let tableId: string
  export let field: LongTextField
  export let value: string
  export let recordId: string
  export let isEditing: boolean
  export let readonly: boolean
  export let onValueChange: (value: string) => void

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    onSuccess(data, variables, context) {
      el?.blur()
      gridViewStore.exitEditing()
      onValueChange(value)
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  let el: HTMLTextAreaElement
  $: if (isEditing) {
    if (el) {
      el.focus()
    }
  }
</script>

{#if isEditing}
  <div class="absolute -bottom-10 left-0 right-0 top-0">
    <textarea
      rows={3}
      bind:this={el}
      bind:value
      on:blur={() => {
        gridViewStore.exitEditing()
      }}
      class={cn(
        $$restProps.class,
        "focus-visible:ring-ring h-full w-full rounded-none border px-2 text-xs outline-none focus:bg-white",
      )}
      on:change={() => {
        $updateCell.mutate({
          tableId,
          id: recordId,
          values: { [field.id.value]: value },
        })
      }}
    />
  </div>
{:else}
  <div class={cn("truncate", $$restProps.class)}>
    {#if value}
      {value}
    {/if}
  </div>
{/if}
