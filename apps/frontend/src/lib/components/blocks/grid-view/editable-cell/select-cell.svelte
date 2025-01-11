<script lang="ts">
  import { type SelectField } from "@undb/table"

  import Option from "../../option/option.svelte"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { ChevronDownIcon } from "lucide-svelte"
  import OptionsPicker from "../../option/options-picker.svelte"
  import type { IOptionId } from "@undb/table/src/modules/schema/fields/option/option-id.vo"
  import OptionPicker from "../../option/option-picker.svelte"
  import { getDataService } from "$lib/store/data-service.store"

  export let tableId: string
  export let field: SelectField
  export let value: string | string[] | null = null
  export let recordId: string
  export let isEditing: boolean
  export let isSelected: boolean
  export let onValueChange: (id: IOptionId | IOptionId[] | null) => void
  export let readonly: boolean = false

  const dataService = getDataService()

  $: selected = Array.isArray(value)
    ? value.map((v) => field.options.find((o) => o.id === v)).filter((v) => !!v)
    : field.options.find((option) => option.id === value)

  let open = false
  $: if (isEditing) {
    open = true
  }

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: dataService.records.updateRecord,
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  function onSelect(id: IOptionId | IOptionId[] | null) {
    onValueChange(id)
    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: id },
    })
  }
</script>

{#if isEditing}
  <div class={cn($$restProps.class, "flex items-center justify-between py-0")}>
    {#if field.isSingle}
      {#if !Array.isArray(value)}
        <OptionPicker
          class="h-full flex-1 rounded-none border-none bg-transparent p-0 text-left ring-0 focus-visible:ring-0"
          bind:open
          onValueChange={(value) => onSelect(value)}
          bind:value
          options={field.options}
        />
      {/if}
    {:else if Array.isArray(value) || value === null}
      <OptionsPicker
        class="h-full flex-1 rounded-none border-none bg-transparent p-0 text-left ring-0 focus-visible:ring-0"
        bind:open
        onValueChange={(value) => onSelect(value)}
        options={field.options}
        bind:value
      />
    {/if}
    {#if open}
      <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
    {/if}
  </div>
{:else}
  <div class={cn($$restProps.class, "flex justify-between", (isSelected || isEditing) && !selected && "justify-end")}>
    {#if selected}
      {#if Array.isArray(selected)}
        <div class="flex items-center gap-1 overflow-hidden">
          {#each selected as option}
            <Option {option} />
          {/each}
        </div>
      {:else}
        <Option option={selected} />
      {/if}
    {/if}
    {#if (isSelected || open) && !readonly}
      <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
    {/if}
  </div>
{/if}
