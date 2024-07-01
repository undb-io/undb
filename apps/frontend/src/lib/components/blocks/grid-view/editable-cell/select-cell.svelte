<script lang="ts">
  import { type IOption, type SelectField } from "@undb/table"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"

  import Option from "../../option/option.svelte"
  import { cn } from "$lib/utils"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { ChevronDownIcon } from "lucide-svelte"

  export let tableId: string
  export let field: SelectField
  export let value: string
  export let recordId: string
  export let isEditing: boolean
  export let isSelected: boolean

  $: selected = field.options.find((option) => option.id === value)

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

  function onSelect(option: IOption) {
    value = option.id
    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: value },
    })
  }
</script>

{#if isEditing}
  <DropdownMenu.Root bind:open>
    <DropdownMenu.Trigger class={cn($$restProps.class, "w-full")}>
      {#if selected}
        <Option option={selected} />
      {/if}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        {#each field.options as option}
          <DropdownMenu.Item on:click={() => onSelect(option)}>
            <Option {option} />
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{:else}
  <div class={cn($$restProps.class, "flex justify-between", (isSelected || isEditing) && !selected && "justify-end")}>
    {#if selected}
      <Option option={selected} />
    {/if}
    {#if isSelected || isEditing || open}
      <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
    {/if}
  </div>
{/if}
