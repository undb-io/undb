<script lang="ts">
  import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query"
  import { ID_TYPE, Records, ReferenceField, TableDo, type IRecordsDTO } from "@undb/table"
  import { derived, readable, writable, type Readable, type Writable } from "svelte/store"
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
  import CreateForeignRecordButton from "./create-foreign-record-button.svelte"
  import Label from "$lib/components/ui/label/label.svelte"
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte"
  import ForeignRecordDetailButton from "./foreign-record-detail-button.svelte"
  import { getDataService } from "$lib/store/data-service.store"
  import { type IUpdateRecordCommand } from "@undb/commands"

  export let foreignTable: Readable<TableDo>
  export let isSelected = false
  export let shouldUpdate = false
  export let readonly = false
  export let r: Writable<string | null>

  export let tableId: string
  export let recordId: string | undefined = undefined
  export let field: ReferenceField
  export let onValueChange = (value: string[]) => {}
  export let onSuccess: (id?: string) => void

  const dataService = getDataService()

  let linkAfterCreate = true

  const perPage = writable(20)
  const currentPage = writable(1)

  export let selected: Writable<string[]>

  const q = writable("")

  $: fields = $foreignTable.getOrderedVisibleFields().slice(0, 4)

  const getForeignTableRecords = createQuery(
    derived([foreignTable, q, perPage, currentPage, selected], ([$table, $q, $perPage, $currentPage, $selected]) => {
      return {
        queryKey: ["records", $table.id.value, $q, $currentPage, $selected?.length],
        enabled: !!$table,
        queryFn: () =>
          dataService.records.getRecords({
            tableId: $table.id.value,
            q: $q || undefined,
            ignoreView: true,
            filters: $selected?.length
              ? {
                  conjunction: "and",
                  children: isSelected
                    ? [
                        {
                          field: ID_TYPE,
                          op: "in" as const,
                          value: $selected,
                        },
                      ]
                    : [
                        {
                          field: ID_TYPE,
                          op: "nin" as const,
                          value: $selected,
                        },
                        field.condition,
                      ].filter((c) => !!c),
                }
              : field.condition,
            select: fields.map((f) => f.id.value),
            pagination: { limit: $perPage, page: $currentPage },
          }),
      }
    }),
  )
  let total = 0
  $: if ($getForeignTableRecords.data) {
    // @ts-ignore
    total = $getForeignTableRecords.data.total
  }
  $: totalPage = Math.ceil(total / $perPage)

  $: records = (($getForeignTableRecords.data as any)?.records as IRecordsDTO) ?? []
  $: dos = Records.fromJSON($foreignTable, records).map

  const client = useQueryClient()
  const updateCell = createMutation({
    mutationKey: ["record", tableId, field.id.value, recordId],
    mutationFn: dataService.records.updateRecord,
    async onSuccess(data, variables, context) {
      await client.invalidateQueries({ queryKey: ["records", field.foreignTableId] })
      onSuccess?.(recordId)
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  async function handleToggleRecord(id: string, isAdd: boolean) {
    if (readonly) return
    if (!isAdd) {
      $selected = $selected?.filter((s) => s !== id) ?? []
    } else {
      $selected = unique([...($selected ?? []), id])
    }
    onValueChange($selected)
    if (shouldUpdate) {
      if (recordId) {
        await $updateCell.mutateAsync({
          tableId,
          id: recordId,
          values: { [field.id.value]: $selected },
        })
        $getForeignTableRecords.refetch()
      }
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
    {#if $selected?.length && !isSelected}
      <button
        on:click={() => {
          isSelected = true
          $getForeignTableRecords.refetch()
        }}
        class="inline-flex items-center border-l border-none border-gray-500 bg-gray-100 px-4 py-1 text-xs font-medium text-gray-600 ring-0 ring-inset ring-gray-500/10"
      >
        {$selected.length} selected records
      </button>
    {/if}
    {#if isSelected && !readonly}
      <button
        on:click={() => {
          isSelected = false
          $getForeignTableRecords.refetch()
        }}
        class="inline-flex items-center border-l border-none border-gray-500 bg-gray-100 px-4 py-1 text-xs font-medium text-gray-600 ring-0 ring-inset ring-gray-500/10"
      >
        + Link {$foreignTable.name.value} records
      </button>
    {/if}
  </div>
  {#if !records.length && !$getForeignTableRecords.isFetching}
    <div class="flex flex-1 flex-col items-center justify-center space-y-2 py-8">
      <InboxIcon class="h-12 w-12" />
      <p class="text-muted-foreground text-sm">No available records to link in table {$foreignTable.name.value}</p>
      {#if !readonly}
        <CreateForeignRecordButton
          onSuccess={(id) => {
            isSelected = true
            handleToggleRecord(id, true)
          }}
          {foreignTable}
        />
        <Label class="text-muted-foreground flex items-center gap-2 text-xs">
          <Checkbox bind:checked={linkAfterCreate} />
          Link After Create
        </Label>
      {/if}
    </div>
  {:else}
    <div class="flex flex-1 flex-col overflow-hidden">
      {#if $getForeignTableRecords.isFetching}
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
              {@const re = dos.get(record.id)}
              <div class="group flex-1 space-y-2">
                {#if re}
                  {@const values = re.flatten()}
                  {@const displayValues = re.displayValues?.toJSON() ?? {}}
                  <div class="flex w-full flex-1 items-center gap-2">
                    {#if fields.length}
                      {@const field = fields[0]}
                      <div class="flex-1 space-y-1">
                        <Tooltip.Root portal="body">
                          <Tooltip.Trigger asChild let:builder>
                            <span
                              class="inline-flex max-w-80 items-center overflow-hidden px-3 pt-2"
                              use:builderActions={{ builders: [builder] }}
                              {...getAttrs([builder])}
                            >
                              <FieldValue
                                {r}
                                tableId={$foreignTable.id.value}
                                recordId={record.id}
                                {field}
                                value={values[field.id.value]}
                                type={field.type}
                                displayValue={displayValues[field.id.value]}
                                class="truncate font-semibold"
                                title={values[field.id.value]}
                                placeholder="-"
                              />
                            </span>
                          </Tooltip.Trigger>
                          <Tooltip.Content transition={() => ({ duration: 10 })}>
                            <div class="flex items-center gap-2">
                              <FieldIcon {field} class="h-3 w-3" type={field.type} />
                              <p>{field.name.value}</p>
                            </div>
                          </Tooltip.Content>
                        </Tooltip.Root>
                        <div class="grid grid-cols-3 gap-1.5 overflow-hidden px-3 pb-2" data-record-id={record.id}>
                          {#each fields.slice(1) as field}
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild let:builder>
                                <span
                                  class="inline-flex items-center overflow-hidden"
                                  use:builderActions={{ builders: [builder] }}
                                  {...getAttrs([builder])}
                                >
                                  <FieldValue
                                    {r}
                                    tableId={$foreignTable.id.value}
                                    recordId={record.id}
                                    {field}
                                    value={values[field.id.value]}
                                    type={field.type}
                                    displayValue={displayValues[field.id.value]}
                                    class="truncate text-xs"
                                    placeholder="-"
                                  />
                                </span>
                              </Tooltip.Trigger>
                              <Tooltip.Content transitionConfig={{ duration: 10 }}>
                                <div class="flex items-center gap-2">
                                  <FieldIcon {field} class="h-3 w-3" type={field.type} />
                                  <p>{field.name.value}</p>
                                </div>
                              </Tooltip.Content>
                            </Tooltip.Root>
                          {/each}
                        </div>
                      </div>

                      <div class="flex items-center gap-1 pr-4">
                        <ForeignRecordDetailButton
                          class="opacity-0 group-hover:opacity-100"
                          {foreignTable}
                          {r}
                          recordId={readable(record.id)}
                          {readonly}
                          viewId={readable(undefined)}
                        />
                        {#if !readonly}
                          {#if isSelected}
                            <Button
                              size="icon"
                              class="h-7 w-7"
                              variant="outline"
                              on:click={() => handleToggleRecord(record.id, false)}
                            >
                              <MinusIcon class="h-5 w-5 font-semibold" />
                            </Button>
                          {:else}
                            <Button size="icon" class="h-7 w-7" on:click={() => handleToggleRecord(record.id, true)}>
                              <PlusIcon class="h-5 w-5 font-semibold" />
                            </Button>
                          {/if}
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
        {#if !readonly}
          <div class="flex h-full flex-1 items-center gap-1">
            <CreateForeignRecordButton
              onSuccess={(id) => {
                if (linkAfterCreate) {
                  handleToggleRecord(id, true)
                }
              }}
              {foreignTable}
            />
            <Label class="inline-flex items-center gap-1 text-xs">
              <Checkbox bind:checked={linkAfterCreate} />
              Link After Create
            </Label>
          </div>
        {/if}
        {#if total > 20}
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
        {/if}
      </div>
    </div>
  {/if}
</div>
