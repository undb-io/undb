<script lang="ts">
  import * as Popover from "$lib/components/ui/popover"
  import ForeignRecordsPicker from "./foreign-records-picker.svelte"
  import { derived, writable } from "svelte/store"
  import { ReferenceField, TableFactory } from "@undb/table"
  import Button from "$lib/components/ui/button/button.svelte"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { type Writable } from "svelte/store"
  import { LL } from "@undb/i18n/client"
  import { createQuery } from "@tanstack/svelte-query"
  import { getDataService } from "$lib/store/data-service.store"

  export let isSelected = false

  export let shouldUpdate = false
  export let readonly = false
  export let tableId: string
  export let r: Writable<string | null>
  export let recordId: string | undefined
  export let field: ReferenceField
  $: foreignTableId = field.foreignTableId
  export let selected = writable<string[]>()
  export let onValueChange = (value: string[]) => {}
  export let onOpenChange: (open: boolean) => void = () => {}
  export let onSuccess: (id?: string) => void = () => {}

  let open = false

  const dataService = getDataService()

  const getForeignTable = createQuery({
    queryKey: ["foreignTable", foreignTableId, open],
    queryFn: async () => {
      return dataService.table.getTable({ tableId: foreignTableId })
    },
  })

  const foreignTable = derived(getForeignTable, ($getForeignTable) =>
    $getForeignTable.data ? new TableFactory().fromJSON($getForeignTable.data) : null,
  )
</script>

<Popover.Root portal="body" bind:open {onOpenChange}>
  <Popover.Trigger asChild let:builder>
    <slot {builder}>
      <Button size="xs" disabled={readonly} variant="link" type="button" builders={[builder]}
        >+ {$LL.table.record.reference.link()}</Button
      >
    </slot>
  </Popover.Trigger>
  <Popover.Content class="h-[400px] max-h-[700px] w-[500px] p-0 lg:max-w-4xl">
    {#if $getForeignTable.isPending}
      <!-- content here -->
      <div class="flex h-full w-full items-center justify-center space-y-2 p-4">
        <LoaderCircleIcon class="mr-2 h-8 w-8 animate-spin" />
      </div>
    {/if}
    {#if $foreignTable}
      <ForeignRecordsPicker
        {readonly}
        {r}
        {shouldUpdate}
        bind:isSelected
        {field}
        {tableId}
        {recordId}
        {foreignTable}
        bind:selected
        {onValueChange}
        {onSuccess}
      />
    {/if}
  </Popover.Content>
</Popover.Root>
