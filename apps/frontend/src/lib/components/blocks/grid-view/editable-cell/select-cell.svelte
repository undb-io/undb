<script lang="ts">
  import { type SelectField } from "@undb/table"

  import Option from "../../option/option.svelte"
  import { cn } from "$lib/utils"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { ChevronDownIcon } from "lucide-svelte"
  import OptionsPicker from "../../option/options-picker.svelte"
  import type { IOptionId } from "@undb/table/src/modules/schema/fields/option/option-id.vo"
  import OptionPicker from "../../option/option-picker.svelte"

  export let tableId: string
  export let field: SelectField
  export let value: string | string[] | null = null
  export let recordId: string
  export let isEditing: boolean
  export let isSelected: boolean

  $: selected = Array.isArray(value)
    ? value.map((v) => field.options.find((o) => o.id === v)).filter((v) => !!v)
    : field.options.find((option) => option.id === value)

  let open = false
  $: if (isEditing) {
    open = true
  }

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  function onSelect(id: IOptionId | IOptionId[] | null) {
    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: value },
    })
  }
</script>

{#if isEditing}
  {#if field.isSingle}
    {#if !Array.isArray(value)}
      <OptionPicker bind:open onValueChange={(value) => onSelect(value)} {field} bind:value />
    {/if}
  {:else if Array.isArray(value) || value === null}
    <OptionsPicker bind:open onValueChange={(value) => onSelect(value)} {field} bind:value />
  {/if}
{:else}
  <div class={cn($$restProps.class, "flex justify-between", (isSelected || isEditing) && !selected && "justify-end")}>
    {#if selected}
      {#if Array.isArray(selected)}
        {#each selected as option}
          <Option {option} />
        {/each}
      {:else}
        <Option option={selected} />
      {/if}
    {/if}
    {#if isSelected || isEditing || open}
      <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
    {/if}
  </div>
{/if}
