<script lang="ts">
  import { isUserFieldMacro, UserField, type IUserFieldDisplayValue, type IUserFieldValue } from "@undb/table"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import UserFieldComponent from "$lib/components/blocks/field-value/user-field.svelte"
  import UserPicker from "../../user/user-picker.svelte"
  import UsersPicker from "../../user/users-picker.svelte"
  import { builderActions, getAttrs } from "bits-ui"
  import { ChevronDownIcon } from "lucide-svelte"
  import UserMacro from "../../user/user-macro.svelte"
  import { getRecordsStore } from "$lib/store/records.store"
  import { getTable } from "$lib/store/table.store"
  import { getDataService } from "$lib/store/data-service.store"

  export let tableId: string
  export let field: UserField
  export let value: IUserFieldValue
  export let displayValue: IUserFieldDisplayValue[] | IUserFieldDisplayValue | null
  export let recordId: string
  export let isEditing: boolean
  export let isSelected: boolean
  export let onValueChange = (value: IUserFieldValue) => {}

  let open = false
  $: if (isEditing) {
    open = true
  }

  const table = getTable()

  const store = getRecordsStore()

  const dataService = getDataService()

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: dataService.records.updateRecord,
    async onSuccess(data, variables) {
      const value = variables.values[field.id.value]
      if (isUserFieldMacro(value)) {
        await store?.invalidateRecord(dataService, $table, recordId)
      }
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  function onSelect(value: IUserFieldValue) {
    onValueChange(value)
    $updateCell.mutate({
      tableId,
      id: recordId,
      values: { [field.id.value]: value },
    })
  }
</script>

<div class={$$restProps.class}>
  {#if field.isSingle}
    {#if !Array.isArray(value) && !Array.isArray(displayValue)}
      <UserPicker bind:open bind:value onValueChange={onSelect}>
        <div
          slot="trigger"
          let:builder
          let:selected
          use:builderActions={{ builders: [builder] }}
          {...getAttrs([builder])}
          class="flex w-full items-center justify-between"
        >
          <UserFieldComponent disableHoverCard {value} displayValue={selected?.user ?? displayValue} />
          {#if isEditing}
            <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
          {/if}
        </div>
      </UserPicker>
    {/if}
  {:else if (Array.isArray(value) || value === null) && (Array.isArray(displayValue) || !displayValue)}
    <UsersPicker disabled={!isSelected} bind:value bind:open onValueChange={onSelect}>
      <div
        slot="trigger"
        let:builder
        let:selected
        use:builderActions={{ builders: [builder] }}
        {...getAttrs([builder])}
        class="flex w-full flex-nowrap items-center justify-between overflow-hidden"
      >
        <div class="flex flex-1 items-center gap-1 overflow-hidden">
          {#each value ?? [] as user, i}
            {#if isUserFieldMacro(user)}
              <UserMacro value={user} />
            {:else}
              {@const value = selected.find((u) => u.user.id === user)?.user ?? displayValue?.[i]}
              <UserFieldComponent disableHoverCard value={user} displayValue={value} />
            {/if}
          {/each}
        </div>
        {#if isEditing}
          <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
        {/if}
      </div>
    </UsersPicker>
  {/if}
</div>
