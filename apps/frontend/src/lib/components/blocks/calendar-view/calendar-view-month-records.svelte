<script lang="ts">
  import { getConditionGroupCount, mergeConditionGroups, type DateField, type DateRangeField } from "@undb/table"
  import { createInfiniteQuery, type CreateInfiniteQueryOptions } from "@tanstack/svelte-query"
  import CalendarViewMonthRecordsFilterPicker from "./calendar-view-month-records-filter-picker.svelte"
  import { derived, type Writable } from "svelte/store"
  import { getTable } from "$lib/store/table.store"
  import { type Readable } from "svelte/store"
  import { trpc } from "$lib/trpc/client"
  import { calendarStore } from "$lib/store/calendar.store"
  import { type IRecordsDTO, type IViewFilterGroup, Records } from "@undb/table"
  import { format } from "date-fns"
  import { match } from "ts-pattern"
  import { Input } from "$lib/components/ui/input"
  import { SearchIcon } from "lucide-svelte"
  import { writable } from "svelte/store"
  import CalendarViewMonthRecord from "./calendar-view-month-record.svelte"
  import { createVirtualizer } from "@tanstack/svelte-virtual"
  import { inview } from "svelte-inview"
  import { LoaderCircleIcon } from "lucide-svelte"
  import { CalendarView } from "@undb/table"
  import { type MaybeConditionGroup, type IViewFilterOptionSchema } from "@undb/table"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  export let viewId: Readable<string | undefined>
  export let view: CalendarView
  export let field: DateField | DateRangeField
  export let r: Writable<string | null>
  export let shareId: string | undefined
  export let readonly = false

  const t = getTable()

  const dataService = getDataService()

  let defaultField = $t.schema.getDefaultDisplayField().into(undefined)

  const startTimestamp = calendarStore.startTimestamp
  const endTimestamp = calendarStore.endTimestamp
  const startOfWeekTimestamp = calendarStore.startOfWeekTimestamp
  const endOfWeekTimestamp = calendarStore.endOfWeekTimestamp
  const scope = $calendarStore.scope

  const search = writable("")

  const value = writable<MaybeConditionGroup<IViewFilterOptionSchema> | undefined>()
  let validValue: Writable<IViewFilterGroup | undefined> = writable(undefined)

  const getRecords = createInfiniteQuery(
    derived(
      [t, viewId, calendarStore, startTimestamp, endTimestamp, search, validValue, scope],
      ([$table, $viewId, $calendarStore, $startTimestamp, $endTimestamp, $search, $filter, $scope]) => {
        const date = $calendarStore.selectedDate

        const filters = match($scope)
          .returnType<IViewFilterGroup | undefined>()
          .with("selectedDate", () => {
            if (!date) return undefined
            const value = format(date, "yyyy-MM-dd")
            return {
              conjunction: "and",
              children: [{ field: field.id.value, op: "is_same_day", value }],
            }
          })
          .with("thisMonth", () => {
            if (!$startTimestamp || !$endTimestamp) return undefined
            return {
              conjunction: "and",
              children: [
                { field: field.id.value, op: "is_after", value: $startTimestamp!.toISOString() },
                { field: field.id.value, op: "is_before", value: $endTimestamp!.toISOString() },
              ],
            }
          })
          .with("withoutDate", () => {
            return {
              conjunction: "and",
              children: [{ field: field.id.value, op: "is_empty" }],
            }
          })
          .with("thisWeek", () => {
            if (!$startOfWeekTimestamp || !$endOfWeekTimestamp) return undefined
            return {
              conjunction: "and",
              children: [
                { field: field.id.value, op: "is_after", value: $startOfWeekTimestamp!.toISOString() },
                { field: field.id.value, op: "is_before", value: $endOfWeekTimestamp!.toISOString() },
              ],
            }
          })
          .otherwise(() => undefined)

        const merged = filters && $filter ? mergeConditionGroups(filters, $filter) : (filters ?? $filter)

        const dateString = match($scope)
          .returnType<string | undefined>()
          .with("selectedDate", () => date?.toISOString())
          .with("thisMonth", () => $startTimestamp?.toISOString())
          .with("thisWeek", () => $startOfWeekTimestamp?.toISOString())
          .otherwise(() => undefined)
        return {
          queryKey: ["records", $table?.id.value, $viewId, $scope, dateString, $search],
          queryFn: async ({ pageParam = 1 }) => {
            if (shareId) {
              return trpc.shareData.records.query({
                shareId,
                tableId: $table?.id.value,
                viewId: $viewId,
                filters: merged,
                ignoreView: true,
                q: $search,
                pagination: {
                  page: pageParam,
                  limit: 20,
                },
              })
            }
            return dataService.records.getRecords({
              tableId: $table?.id.value,
              viewId: $viewId,
              filters: merged,
              ignoreView: true,
              q: $search,
              pagination: {
                page: pageParam,
                limit: 20,
              },
            })
          },
          initialPageParam: 1,
          getNextPageParam: (lastPage, pages) => {
            const current = pages.reduce<number>((acc, cur) => acc + cur.records.length, 0)
            if (current >= lastPage.total) {
              return undefined
            }
            return pages.length + 1
          },
        } as CreateInfiniteQueryOptions
      },
    ),
  )

  $: rs = ($getRecords.data?.pages.flatMap((page) => page.records) ?? []) as IRecordsDTO
  $: records = Records.fromJSON($t, rs)

  let virtualListEl: HTMLDivElement
  let virtualItemEls: HTMLDivElement[] = []

  $: color = $viewId ? $t.views.getViewById($viewId)?.color.into(undefined) : undefined

  $: virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    count: records?.count ?? 0,
    getScrollElement: () => virtualListEl,
    estimateSize: () => 60,
    overscan: 5,
  })

  $: items = $virtualizer.getVirtualItems()

  $: {
    if (virtualItemEls.length) {
      virtualItemEls.forEach((el) => $virtualizer.measureElement(el))
    }
  }

  let open = false
  let count = derived(validValue, ($validValue) => ($validValue ? getConditionGroupCount($validValue) : 0))

  function handleSubmit(value?: IViewFilterGroup) {
    validValue.set(value)
    open = false
  }
</script>

<div class="flex h-full flex-1 flex-col gap-2 overflow-hidden p-2">
  <div class="flex items-center justify-between gap-1.5 text-sm font-medium">
    <span> {$LL.table.record.labels()} </span>

    <span class="flex-1">
      <CalendarViewMonthRecordsFilterPicker bind:view />
    </span>
  </div>

  <!-- <div>
    <Popover.Root bind:open portal="body">
      <Popover.Trigger asChild let:builder>
        <Button
          variant={$count || open ? "secondary" : "ghost"}
          builders={[builder]}
          size="sm"
          {...$$restProps}
          class="w-full justify-start text-left"
        >
          <FilterIcon class="mr-2 h-4 w-4" />
          Filters
          {#if $count}
            <Badge variant="secondary" class="ml-2 rounded-full">{$count}</Badge>
          {/if}
        </Button>
      </Popover.Trigger>
      <Popover.Content class="w-[450px] space-y-2 p-0 shadow-2xl">
        {#if $value?.children.length}
          <div class="text-muted-foreground px-4 py-3 pb-0 text-xs">Filters</div>
        {/if}
        <FiltersEditor
          {readonly}
          bind:value={$value}
          table={$t}
          on:submit={(e) => handleSubmit(e.detail)}
          filter={(field) => getIsFilterableFieldType(field.type)}
        ></FiltersEditor>
      </Popover.Content>
    </Popover.Root>
  </div> -->

  <div class="flex items-center justify-between gap-2">
    <SearchIcon class="size-3 text-gray-500" />
    <Input bind:value={$search} class="h-6 flex-1 text-xs" placeholder={$LL.table.record.search()} />
  </div>

  <div class="flex-1 overflow-auto" bind:this={virtualListEl}>
    {#if !records.isEmpty}
      <div style="position: relative; height: {$virtualizer.getTotalSize()}px; width: 100%;">
        <div
          class="space-y-2"
          style="position: absolute; top: 0; left: 0; width: 100%; transform: translateY({items[0]
            ? items[0].start
            : 0}px);"
        >
          {#each items as row, idx (row.key)}
            <div bind:this={virtualItemEls[idx]}>
              <CalendarViewMonthRecord
                {r}
                {color}
                record={records?.records[row.index]}
                {defaultField}
                {field}
                {shareId}
                {readonly}
              />
            </div>
          {/each}
        </div>
      </div>

      {#if $getRecords.hasNextPage}
        <div
          use:inview={{
            unobserveOnEnter: false,
            rootMargin: "50px",
          }}
          on:inview_change={({ detail }) => {
            if (detail.inView && !$getRecords.isFetching) {
              $getRecords.fetchNextPage()
            }
          }}
          class="h-4"
        >
          {#if $getRecords.isFetching}
            <div class="flex justify-center">
              <LoaderCircleIcon class="h-4 w-4 animate-spin" />
            </div>
          {/if}
        </div>
      {/if}
    {:else if !$getRecords.isPending}
      <div class="flex h-full flex-1 items-center justify-center">
        <span class="text-muted-foreground text-sm">{$LL.table.record.empty()}</span>
      </div>
    {/if}
  </div>
</div>
