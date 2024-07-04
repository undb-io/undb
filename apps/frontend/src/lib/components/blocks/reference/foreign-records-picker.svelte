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
  import { ChevronLeftIcon, ChevronRightIcon, InboxIcon, PlusIcon, SearchIcon, MinusIcon } from "lucide-svelte"
  import { Button } from "$lib/components/ui/button"
  import { Input } from "$lib/components/ui/input"
  import { toast } from "svelte-sonner"
  import { unique } from "radash"

  export let foreignTable: Readable<TableDo>
  export let isSelected = false

  export let tableId: string
  export let recordId: string | undefined = undefined
  export let field: ReferenceField

  const perPage = writable(20)
  const currentPage = writable(1)

  export let selected: string[] = []

  const q = writable("")

  const getForeignTableRecords = createQuery(
    derived([foreignTable, q, perPage, currentPage], ([$table, $q, $perPage, $currentPage]) => ({
      queryKey: ["records", $table.id.value, $q, $currentPage],
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
                    op: isSelected ? "in" : "nin",
                    value: selected,
                  },
                ],
              }
            : undefined,
          pagination: { limit: $perPage, page: $currentPage },
        }),
    })),
  )
  let total = 0
  $: if ($getForeignTableRecords.data) {
    // @ts-ignore
    total = $getForeignTableRecords.data.total
  }
  $: totalPage = Math.ceil(total / $perPage)

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

  $: console.log(isSelected)

  async function handleClickRecord(id: string) {
    if (isSelected) {
      selected = selected?.filter((s) => s !== id) ?? []
    } else {
      selected = unique([...(selected ?? []), id])
    }
    if (recordId) {
      await $updateCell.mutateAsync({
        tableId,
        id: recordId,
        values: { [field.id.value]: selected },
      })

      $getForeignTableRecords.refetch()
    }
  }
</script>

<div class="flex h-full flex-col divide-y">
  <div class="flex h-9 bg-gray-50">
    <div class="flex h-full w-9 items-center justify-center">
      <SearchIcon class="text-muted-foreground h-4 w-4" />
    </div>
    <Input
      autofocus
      class="h-full flex-1 rounded-none border-0 pl-0 focus-visible:ring-0"
      placeholder={`Search ${$foreignTable.name.value} records...`}
      bind:value={$q}
    />
    {#if selected?.length}
      <span
        class="inline-flex items-center bg-gray-100 px-4 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
      >
        {selected.length} selected records
      </span>
    {/if}
  </div>
  {#if !records.length && !$getForeignTableRecords.isLoading}
    <div class="flex flex-1 flex-col items-center justify-center space-y-2 py-8">
      <InboxIcon class="h-12 w-12" />
      <p class="text-muted-foreground text-sm">No available records to link in table {$foreignTable.name.value}</p>
    </div>
  {:else}
    <div class="flex flex-1 flex-col overflow-hidden">
      {#if $getForeignTableRecords.isLoading}
        <div class="flex-1 space-y-2 p-4">
          <div class="h-[80px] space-y-2">
            <Skeleton class="h-[30px] w-[100px] rounded-sm" />
            <Skeleton class="h-[30px] w-full rounded-sm" />
          </div>
          <div class="h-[80px] space-y-2">
            <Skeleton class="h-[30px] w-[100px] rounded-sm" />
            <Skeleton class="h-[30px] w-full rounded-sm" />
          </div>
          <div class="h-[80px] space-y-2">
            <Skeleton class="h-[30px] w-[100px] rounded-sm" />
            <Skeleton class="h-[30px] w-full rounded-sm" />
          </div>
          <div class="h-[80px] space-y-2">
            <Skeleton class="h-[30px] w-[100px] rounded-sm" />
            <Skeleton class="h-[30px] w-full rounded-sm" />
          </div>
          <div class="h-[80px] space-y-2">
            <Skeleton class="h-[30px] w-[100px] rounded-sm" />
            <Skeleton class="h-[30px] w-full rounded-sm" />
          </div>
        </div>
      {:else}
        <ScrollArea orientation="both" class="h-full flex-1 overflow-auto">
          <div class="divide-y">
            {#each records as record}
              {@const r = dos.get(record.id)}
              <div class="flex-1 space-y-2">
                {#if r}
                  {@const values = r.flatten()}
                  {@const displayValues = r.displayValues?.toJSON() ?? {}}
                  <div class="flex items-center gap-2">
                    {#if fields.length}
                      {@const field = fields[0]}
                      <div class="flex-1 space-y-2">
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild let:builder>
                            <span
                              class="inline-flex items-center px-3 pt-2"
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
                                class="font-semibold"
                                placeholder="-"
                              />
                            </span>
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
                                <span
                                  class="inline-flex items-center"
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
                                    class="text-xs"
                                    placeholder="-"
                                  />
                                </span>
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
                        {#if isSelected}
                          <Button
                            size="icon"
                            class="h-7 w-7"
                            variant="outline"
                            on:click={() => handleClickRecord(record.id)}
                          >
                            <MinusIcon class="h-5 w-5 font-semibold" />
                          </Button>
                        {:else}
                          <Button size="icon" class="h-7 w-7" on:click={() => handleClickRecord(record.id)}>
                            <PlusIcon class="h-5 w-5 font-semibold" />
                          </Button>
                        {/if}
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </ScrollArea>
      {/if}
      <div class="flex h-10 items-center justify-between border-t bg-gray-50 px-4">
        <div class="h-full flex-1"></div>
        <div class="flex h-full items-center justify-end gap-1">
          <Button
            disabled={$currentPage <= 1}
            on:click={() => $currentPage--}
            variant="outline"
            size="xs"
            class="h-7 w-7"
          >
            <ChevronLeftIcon class="h-5 w-5" />
          </Button>
          <Input
            min="1"
            max={totalPage}
            step={1}
            class="bg-background h-7 w-7 px-1 text-center text-xs"
            value={$currentPage}
            on:change={(e) => {
              currentPage.set(Number(e.target.value))
            }}
          />
          <div class="px-1 text-xs">/</div>
          <div class="px-1 text-xs">
            {totalPage}
          </div>
          <Button
            disabled={$currentPage >= totalPage}
            variant="outline"
            size="xs"
            class="h-7 w-7"
            on:click={() => $currentPage++}
          >
            <ChevronRightIcon class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  {/if}
</div>
