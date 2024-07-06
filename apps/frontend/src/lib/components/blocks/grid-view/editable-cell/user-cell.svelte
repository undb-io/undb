<script lang="ts">
  import { UserField, type IUserFieldDisplayValue, type IUserFieldValue } from "@undb/table"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import UserFieldComponent from "$lib/components/blocks/field-value/user-field.svelte"
  import UserPicker from "../../user/user-picker.svelte"
  import UsersPicker from "../../user/users-picker.svelte"
  import { builderActions, getAttrs } from "bits-ui"
  import { ChevronDownIcon } from "lucide-svelte"

  export let tableId: string
  export let field: UserField
  export let value: IUserFieldValue
  export let displayValue: IUserFieldDisplayValue[] | IUserFieldDisplayValue | null
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

  function onSelect(value: IUserFieldValue) {
    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: value },
    })
  }
</script>

<div class={$$restProps.class}>
  {#if isEditing}
    {#if field.isSingle}
      {#if !Array.isArray(value)}
        <UserPicker bind:open bind:value>
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
      {/if}
    {:else if Array.isArray(value) || value === null}
      <UsersPicker bind:value bind:open onValueChange={onSelect}>
        <div
          slot="trigger"
          let:builder
          use:builderActions={{ builders: [builder] }}
          {...getAttrs([builder])}
          class="flex w-full flex-nowrap items-center justify-between overflow-hidden"
        >
          <div class="flex flex-1 items-center gap-1 overflow-hidden">
            {#each value ?? [] as user, i}
              <UserFieldComponent disableHoverCard value={user} displayValue={displayValue?.[i]} />
            {/each}
          </div>
          <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
        </div>
      </UsersPicker>
    {/if}
  {:else}
    <div class="flex w-full items-center justify-between">
      {#if field.isSingle}
        {#if !Array.isArray(value)}
          <UserFieldComponent disableHoverCard={!isSelected || isEditing} {value} {displayValue} />
        {/if}
      {:else}
        <div class="flex items-center gap-1 overflow-hidden">
          {#if Array.isArray(value)}
            {#each value as id, i}
              <UserFieldComponent
                disableHoverCard={!isSelected || isEditing}
                value={id}
                displayValue={displayValue?.[i]}
              />
            {/each}
          {/if}
        </div>
      {/if}

      {#if isSelected}
        <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
      {/if}
    </div>
  {/if}
</div>
