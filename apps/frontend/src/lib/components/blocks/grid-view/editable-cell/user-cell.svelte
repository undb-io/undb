<script lang="ts">
  import { UserField, type IOption, type SelectField } from "@undb/table"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"

  import { cn } from "$lib/utils"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import UserFieldComponent from "$lib/components/blocks/field-value/user-field.svelte"
  import UserPicker from "../../user/user-picker.svelte"
  import { builderActions, getAttrs } from "bits-ui"
  import { ChevronDownIcon } from "lucide-svelte"

  export let tableId: string
  export let field: UserField
  export let value: string | undefined
  export let displayValue: string | undefined
  export let recordId: string
  export let isEditing: boolean
  export let isSelected: boolean

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

<div class={$$restProps.class}>
  {#if isEditing}
    <UserPicker bind:value>
      <div
        slot="trigger"
        let:builder
        use:builderActions={{ builders: [builder] }}
        {...getAttrs([builder])}
        class="flex w-full items-center justify-between"
      >
        <UserFieldComponent disableHoverCard {value} {displayValue} />
        <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
      </div>
    </UserPicker>
  {:else}
    <UserFieldComponent disableHoverCard={!isSelected || isEditing} {value} {displayValue} />
  {/if}
</div>
