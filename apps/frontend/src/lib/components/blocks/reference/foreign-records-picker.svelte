<script lang="ts">
  import { createMutation, createQuery } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { ID_TYPE, Records, ReferenceField, TableDo, type IRecordsDTO } from "@undb/table"
  import { derived, writable, type Readable } from "svelte/store"
  import { ScrollArea } from "$lib/components/ui/scroll-area"
  import FieldValue from "../field-value/field-value.svelte"
  import { Skeleton } from "$lib/components/ui/skeleton"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { builderActions, getAttrs } from "bits-ui"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { InboxIcon, PlusIcon } from "lucide-svelte"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { toast } from "svelte-sonner"
  import { unique } from "radash"

  export let foreignTable: Readable<TableDo>

  export let tableId: string
  export let recordId: string | undefined = undefined
  export let field: ReferenceField

  export let selected: string[] = []

  const q = writable("")

  const getForeignTableRecords = createQuery(
    derived([foreignTable, q], ([$table, $q]) => ({
      queryKey: ["records", $table.id.value, $q],
      enabled: !!$table,
      queryFn: () =>
        trpc.record.list.query({
          tableId: $table.id.value,
          q: $q || undefined,
          filters: selected?.length
            ? {
                conjunction: "and",
                children: [
                  {
                    fieldId: ID_TYPE,
                    op: "nin",
                    value: selected,
                  },
                ],
              }
            : undefined,
          pagination: { limit: 50, page: 1 },
        }),
    })),
  )

  $: fields = $foreignTable.schema.noneSystemFields.slice(0, 4)

  $: records = (($getForeignTableRecords.data as any)?.records as IRecordsDTO) ?? []
  $: dos = Records.fromJSON($foreignTable, records).map

  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: trpc.record.update.mutate,
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  function addRecord(id: string) {
    selected = unique([...(selected ?? []), id])
    if (recordId) {
      $updateCell.mutate({
        tableId,
        id: recordId,
        values: { [field.id.value]: selected },
      })
    }
  }
</script>

<ScrollArea orientation="both" class="h-full flex-1  overflow-auto">
  <div class="divide-y">
    <Input
      class="rounded-none border-0"
      placeholder={`Search ${$foreignTable.name.value} records...`}
      bind:value={$q}
    />
    {#if $getForeignTableRecords.isFetching}
      <div class="space-y-2 p-4">
        <Skeleton class="h-[20px] w-full rounded-sm" />
        <Skeleton class="h-[20px] w-full rounded-sm" />
        <Skeleton class="h-[20px] w-full rounded-sm" />
      </div>
    {:else if !records.length}
      <div class="flex flex-col items-center justify-center space-y-2 py-8">
        <InboxIcon class="h-12 w-12" />
        <p class="text-muted-foreground text-sm">No available records to link in table {$foreignTable.name.value}</p>
      </div>
    {:else}
      {#each records as record}
        {@const r = dos.get(record.id)}
        <div class="space-y-2">
          {#if r}
            {@const values = r.flatten()}
            {@const displayValues = r.displayValues?.toJSON() ?? {}}
            <div class="flex items-center gap-2">
              {#if fields.length}
                {@const field = fields[0]}
                <div class="flex-1 space-y-2">
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild let:builder>
                      <div
                        class="flex items-center px-3 pt-2"
                        use:builderActions={{ builders: [builder] }}
                        {...getAttrs([builder])}
                      >
                        <FieldValue
                          {tableId}
                          recordId={record.id}
                          {field}
                          value={values[field.id.value]}
                          type={field.type}
                          displayValue={displayValues[field.id.value]}
                        />
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content transitionConfig={{ duration: 10 }}>
                      <div class="flex items-center gap-2">
                        <FieldIcon class="h-3 w-3" type={field.type} />
                        <p>{field.name.value}</p>
                      </div>
                    </Tooltip.Content>
                  </Tooltip.Root>
                  <div class="grid grid-cols-3 px-3 pb-2" data-record-id={record.id}>
                    {#each fields.slice(1) as field}
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild let:builder>
                          <div
                            class="flex items-center"
                            use:builderActions={{ builders: [builder] }}
                            {...getAttrs([builder])}
                          >
                            <FieldValue
                              {tableId}
                              {recordId}
                              {field}
                              value={values[field.id.value]}
                              type={field.type}
                              displayValue={displayValues[field.id.value]}
                              class="text-xs"
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Content transitionConfig={{ duration: 10 }}>
                          <div class="flex items-center gap-2">
                            <FieldIcon class="h-3 w-3" type={field.type} />
                            <p>{field.name.value}</p>
                          </div>
                        </Tooltip.Content>
                      </Tooltip.Root>
                    {/each}
                  </div>
                </div>

                <div class="pr-4">
                  <Button size="icon" class="h-7 w-7" on:click={() => addRecord(record.id)}>
                    <PlusIcon class="h-5 w-5 font-semibold" />
                  </Button>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</ScrollArea>
