<script lang="ts">
  import { onMount } from "svelte"
  import Sortable from "sortablejs"
  import { createInfiniteQuery, createMutation } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { FieldIdVo, Records, SelectEqual, type IOption, type IRecordsDTO } from "@undb/table"
  import KanbanSkeleton from "./kanban-skeleton.svelte"
  import { getTable } from "$lib/store/table.store"
  import KanbanCard from "./kanban-card.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { LoaderCircleIcon, PlusIcon } from "lucide-svelte"
  import { CREATE_RECORD_MODAL, toggleModal } from "$lib/store/modal.store"
  import { defaultRecordValues } from "$lib/store/records.store"
  import { recordsStore } from "$lib/store/records.store"
  import { Some } from "@undb/domain"
  import { inview } from "svelte-inview"
  import { cn } from "$lib/utils"
  import { hasPermission } from "$lib/store/space-member.store"

  const table = getTable()

  export let tableId: string
  export let viewId: string
  export let fieldId: string
  export let option: IOption
  export let readonly = false
  export let shareId: string

  const getRecords = ({ pageParam = 1 }) => {
    if (shareId) {
      return trpc.shareData.records.query({
        shareId,
        filters: {
          conjunction: "and",
          children: [{ field: fieldId, op: "eq", value: option.id }],
        },
        pagination: {
          page: pageParam,
          limit: 20,
        },
      })
    }

    return trpc.record.list.query({
      tableId,
      viewId,
      filters: {
        conjunction: "and",
        children: [{ field: fieldId, op: "eq", value: option.id }],
      },
      pagination: {
        page: pageParam,
        limit: 20,
      },
    })
  }

  const query = createInfiniteQuery({
    queryKey: [tableId, fieldId, "getRecords", option.id],
    queryFn: getRecords,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const current = pages.reduce<number>((acc, cur) => acc + (cur as any).records.length, 0)
      if (current >= (lastPage as any).total) {
        return undefined
      }
      return pages.length + 1
    },
  })

  let laneElement: HTMLElement

  const updateRecord = createMutation({
    mutationFn: trpc.record.update.mutate,
    onSuccess: (data, variables, context) => {
      recordsStore.setRecordValue(variables.id, fieldId, option.id)
      recordsStore.invalidateRecord($table, variables.id)
    },
  })

  onMount(() => {
    if (!shareId) {
      new Sortable(laneElement, {
        group: "shared",
        animation: 150,
        sort: false,
        dataIdAttr: "data-record-id",
        ghostClass: "bg-gray-100",
        onEnd: (evt) => {
          const recordId = evt.item.dataset.recordId
          if (!recordId) return
          const optionId = evt.to.dataset.optionId
          if (!optionId) return

          $updateRecord.mutate({
            tableId,
            id: recordId,
            values: {
              [fieldId]: optionId,
            },
          })
        },
      })
    }
  })

  // @ts-ignore
  $: records = ($query.data?.pages.flatMap((r) => r.records) as IRecordsDTO) ?? []
  $: if ($query.isSuccess) {
    recordsStore.upsertRecords(Records.fromJSON($table, records))
  }

  $: recordDos = recordsStore.getRecords(Some(new SelectEqual(option.id, new FieldIdVo(fieldId))))

  $: fields = $table.getOrderedVisibleFields(viewId) ?? []
</script>

<div class="max-w-[350px] flex-1 space-y-2 overflow-auto" data-option-id={option.id}>
  <div
    bind:this={laneElement}
    data-option-id={option.id}
    class="min-h-[200px] space-y-2 rounded-lg border bg-gray-100 p-2"
  >
    {#if !readonly && $hasPermission("record:create")}
      <Button
        on:click={() => {
          $defaultRecordValues = {
            [fieldId]: option.id,
          }
          toggleModal(CREATE_RECORD_MODAL)
        }}
        variant="outline"
        size="sm"
        class="w-full"
      >
        <PlusIcon class="text-muted-foreground mr-2 h-4 w-4 font-semibold" />
      </Button>
    {/if}
    {#if $query.isLoading}
      <KanbanSkeleton />
    {:else if $query.isError}
      <p>error: {$query.error.message}</p>
    {:else}
      {#each $recordDos as record (record.id.value)}
        <KanbanCard {readonly} {record} {fields} />
      {/each}
      {#if !readonly}
        <div
          use:inview
          class={cn("flex h-10 w-full items-center justify-center", !$query.hasNextPage && "h-0")}
          on:inview_enter={() => $query.fetchNextPage()}
        >
          {#if $query.isFetching}
            <LoaderCircleIcon class="mr-2 h-5 w-5 animate-spin" />
          {/if}
        </div>
      {/if}
    {/if}
  </div>
</div>
