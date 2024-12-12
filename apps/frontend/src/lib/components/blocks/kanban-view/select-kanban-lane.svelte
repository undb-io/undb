<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import Sortable from "sortablejs"
  import { createInfiniteQuery, createMutation, type CreateInfiniteQueryOptions } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import {
    FieldIdVo,
    KanbanView,
    Records,
    SelectEqual,
    SelectField,
    type IColors,
    type IOption,
    type IRecordsDTO,
  } from "@undb/table"
  import KanbanSkeleton from "./kanban-skeleton.svelte"
  import { derived, type Readable, type Writable } from "svelte/store"
  import { getTable } from "$lib/store/table.store"
  import KanbanCard from "./kanban-card.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import {
    EllipsisIcon,
    GripVerticalIcon,
    LoaderCircleIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    Maximize2Icon,
  } from "lucide-svelte"
  import { CREATE_RECORD_MODAL, toggleModal } from "$lib/store/modal.store"
  import { defaultRecordValues } from "$lib/store/records.store"
  import { getRecordsStore } from "$lib/store/records.store"
  import { Some } from "@undb/domain"
  import { hasPermission } from "$lib/store/space-member.store"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import * as Dialog from "$lib/components/ui/dialog"
  import Option from "../option/option.svelte"
  import OptionEditor from "../option/option-editor.svelte"
  import { toast } from "svelte-sonner"
  import { invalidate } from "$app/navigation"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { match } from "ts-pattern"
  import { cn } from "$lib/utils"
  import { kanbanStore } from "$lib/store/kanban.store"
  import SelectKanbanCollapsedLane from "./select-kanban-collapsed-lane.svelte"
  import { queryParam } from "sveltekit-search-params"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"
  import { type IUpdateRecordCommand } from "@undb/commands"
  import { type IUpdateFieldCommand } from "@undb/commands"

  const table = getTable()
  const recordsStore = getRecordsStore()

  export let tableId: string
  export let view: KanbanView
  export let viewId: Readable<string | undefined>
  export let fieldId: string
  export let field: SelectField
  export let option: IOption | null
  export let readonly = false
  export let shareId: string | undefined = undefined
  export let disableRecordQuery = false
  export let r: Writable<string | null>

  $: color = view.color.into(undefined)

  const q = queryParam("q")

  let getIsLaneCollapsed = kanbanStore.getIsLaneCollapsed
  $: isLaneCollapsed = $viewId ? ($getIsLaneCollapsed($viewId, option?.id ?? "") ?? false) : false

  const dataService = getDataService()

  const query = createInfiniteQuery(
    derived([table, viewId, q], ([$table, $viewId, $q]) => {
      const view = $table.views.getViewById($viewId)
      return {
        queryKey: ["records", $table.id.value, $viewId, fieldId, option?.id, $q],
        queryFn: async ({ pageParam = 1 }) => {
          if (shareId) {
            return trpc.shareData.records.getRecords({
              shareId,
              tableId: $table.id.value,
              viewId: $viewId,
              q: $q,
              filters: {
                conjunction: "and",
                children: [{ field: fieldId, op: "eq", value: option ? option.id : null }],
              },
              pagination: {
                page: pageParam,
                limit: 20,
              },
            })
          }

          return dataService.records.getRecords({
            tableId: $table.id.value,
            viewId: $viewId,
            q: $q ?? undefined,
            filters: {
              conjunction: "and",
              children: [{ field: fieldId, op: "eq", value: option ? option.id : null }],
            },
            pagination: {
              page: pageParam,
              limit: 20,
            },
          })
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
          const current = pages.reduce<number>((acc, cur) => acc + (cur as any).records.length, 0)
          if (current >= (lastPage as any).total) {
            return undefined
          }
          return pages.length + 1
        },
        enabled: view?.type === "kanban" && !disableRecordQuery,
        filters: {
          conjunction: "and",
          children: [{ field: fieldId, op: "eq", value: option ? option.id : null }],
        },
      } as CreateInfiniteQueryOptions
    }),
  )

  let laneElement: HTMLElement

  const spec = Some(new SelectEqual(option?.id ?? null, new FieldIdVo(fieldId)))

  const updateRecord = createMutation({
    mutationFn: dataService.records.updateRecord,
    onError: (error, variables, context) => {
      toast.error(error.message)
    },
  })

  const updateFieldMutation = createMutation({
    mutationFn: dataService.table.field.updateField,
    onSuccess: async (data, variables, context) => {
      toast.success("Option updated")
      updateOptionDialogOpen = false
      await invalidate(`undb:table:${$table.id.value}`)
    },
    onError: (error, variables, context) => {
      toast.error(error.message)
    },
  })

  const updateOption = () => {
    $updateFieldMutation.mutate({
      tableId,
      field: {
        id: fieldId,
        type: "select",
        name: field.name.value,
        option: {
          options: field.option
            .unwrapOrElse(() => ({ options: [] }))
            .options.map((o) => (o.id === option?.id ? { ...option } : o)),
        },
      },
    })
  }

  const deleteOption = () => {
    $updateFieldMutation.mutate({
      tableId,
      field: {
        id: fieldId,
        type: "select",
        name: field.name.value,
        option: {
          options: field.option.unwrapOrElse(() => ({ options: [] })).options.filter((o) => o.id !== option?.id),
        },
      },
    })
  }
  let records = derived(recordsStore, ($recordsStore) =>
    [...$recordsStore.records.values()].filter((record) =>
      spec.isSome() ? spec.unwrap().isSatisfiedBy(record) : true,
    ),
  )

  onMount(() => {
    if (!shareId && !readonly && laneElement) {
      new Sortable(laneElement, {
        group: {
          name: "shared",
          put: (to, from, dragEl, event) => {
            const toOptionId = to.el.dataset.optionId
            if (field.required && !toOptionId) {
              return false
            }

            return true
          },
        },
        animation: 150,
        sort: false,
        dataIdAttr: "data-record-id",
        ghostClass: "bg-gray-100",
        onEnd: (evt) => {
          const recordId = evt.item.dataset.recordId
          if (!recordId) return
          const fromOptionId = evt.from.dataset.optionId ?? null
          const optionId = evt.to.dataset.optionId ?? null

          recordsStore.setRecordValue(recordId, field, optionId)
          if (fromOptionId !== optionId) {
            evt.item.remove()
          }

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

  let lastSetPage = 0
  $: {
    // @ts-ignore
    const records = ($query.data?.pages.slice(lastSetPage).flatMap((r: any) => r.records) as IRecordsDTO) ?? []
    // @ts-ignore
    lastSetPage = $query.data?.pages.length ?? 0
    recordsStore.upsertRecords(Records.fromJSON($table, records))
  }

  onDestroy(() => {
    recordsStore.clearRecords()
  })

  $: fields = $table.getOrderedVisibleFields($viewId) ?? []

  let updateOptionDialogOpen = false
  let deleteOptionDialogOpen = false

  function getKanbanBgColor(color: IColors) {
    return match(color)
      .with("gray", () => "bg-gray-100/50")
      .with("red", () => "bg-red-100/50")
      .with("yellow", () => "bg-yellow-100/50")
      .with("green", () => "bg-green-100/50")
      .with("blue", () => "bg-blue-100/50")
      .with("indigo", () => "bg-indigo-100/50")
      .with("purple", () => "bg-purple-100/50")
      .with("pink", () => "bg-pink-100/50")
      .with("cyan", () => "bg-cyan-100/50")
      .with("emerald", () => "bg-emerald-100/50")
      .with("teal", () => "bg-teal-100/50")
      .with("sky", () => "bg-sky-100/50")
      .with("violet", () => "bg-violet-100/50")
      .with("rose", () => "bg-rose-100/50")
      .with("black", () => "bg-gray-100/50")
      .with("lime", () => "bg-lime-100/50")
      .with("orange", () => "bg-orange-100/50")
      .exhaustive()
  }

  function onCreateRecord() {
    $defaultRecordValues = {
      [fieldId]: option ? option.id : null,
    }
    toggleModal(CREATE_RECORD_MODAL)
  }
</script>

<div
  data-option-id={option?.id ?? null}
  class={cn(
    "kanban-lane flex shrink-0 flex-col rounded-sm transition-all",
    isLaneCollapsed ? "w-10 rounded-md border shadow-sm" : "w-[350px]",
  )}
>
  {#if isLaneCollapsed}
    <div class="mr-2 w-full pt-2" bind:this={laneElement} data-option-id={option?.id ?? null}>
      <SelectKanbanCollapsedLane
        option={option ?? { id: "", name: $LL.table.view.kanban.noOption(), color: "gray" }}
        viewId={$viewId}
      />
    </div>
  {:else}
    <div class="flex w-full items-center justify-between gap-1">
      <div class="flex items-center gap-1">
        {#if !shareId && option && !readonly}
          <div class="lane-handle cursor-move">
            <GripVerticalIcon class="text-muted-foreground h-4 w-4" />
          </div>
        {/if}

        {#if option}
          <Option {option} />
        {:else}
          <Option option={{ id: "", name: $LL.table.view.kanban.noOption(), color: "gray" }} />
        {/if}
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button size="xs" variant="ghost" builders={[builder]}>
            <EllipsisIcon class="text-muted-foreground h-4 w-4" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-48">
          <DropdownMenu.Group>
            <DropdownMenu.Item
              class="text-xs text-gray-700"
              on:click={() => {
                if (!$viewId) {
                  return
                }
                kanbanStore.toggleLane($viewId, option?.id ?? "")
              }}
            >
              <Maximize2Icon class="mr-2 h-3 w-3" />
              {$LL.table.view.kanban.collapseLane()}
            </DropdownMenu.Item>
            {#if !shareId && !readonly && option}
              <DropdownMenu.Item class="text-xs text-gray-700" on:click={() => (updateOptionDialogOpen = true)}>
                <PencilIcon class="mr-2 h-3 w-3" />
                {$LL.table.field.select.option.update()}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                disabled={field.options.length <= 1}
                class="text-xs hover:!bg-red-200 hover:!text-red-700"
                on:click={() => (deleteOptionDialogOpen = true)}
              >
                <TrashIcon class="mr-2 h-3 w-3" />
                {$LL.table.field.select.option.delete()}
              </DropdownMenu.Item>
            {/if}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
    <div class="mt-2 max-w-[350px] flex-1 space-y-2 overflow-hidden" data-option-id={option?.id ?? null}>
      <div
        bind:this={laneElement}
        data-option-id={option?.id ?? null}
        class={cn(
          "h-full flex-1 space-y-2 overflow-y-auto rounded-lg border bg-gray-100 p-2",
          getKanbanBgColor(option?.color ?? "gray"),
        )}
      >
        {#if $hasPermission("record:create")}
          {#if $query.isFetchedAfterMount}
            {#if $records.length > 0}
              <Button on:click={onCreateRecord} variant="outline" size="sm" class="w-full">
                <PlusIcon class="text-muted-foreground mr-2 h-4 w-4 font-semibold" />
              </Button>
            {:else}
              <div class="flex h-full w-full flex-col items-center justify-center space-y-3">
                <p class="text-sm font-semibold">{$LL.table.record.noRecord()}</p>
                <div class="text-muted-foreground space-y-2 text-xs">
                  <p>{$LL.table.field.select.option.createRecord()}</p>

                  <div class="flex w-full items-center justify-center">
                    <Option option={option ?? { id: "", name: $LL.table.view.kanban.noOption(), color: "gray" }} />
                  </div>
                </div>
                {#if !readonly && !(field.required && !option)}
                  <Button on:click={onCreateRecord} variant="outline" size="sm">
                    <PlusIcon class="text-muted-foreground mr-2 h-4 w-4 font-semibold" />
                    {$LL.table.record.create()}
                  </Button>
                {/if}
              </div>
            {/if}
          {/if}
        {/if}
        {#if $query.isLoading}
          <KanbanSkeleton />
        {:else if $query.isError}
          <p>error: {$query.error.message}</p>
        {:else}
          {#each $records as record (record.id.value)}
            <KanbanCard {readonly} {record} {fields} {color} {r} />
          {/each}
          {#if $query.hasNextPage && $query.isFetchedAfterMount}
            <Button
              disabled={$query.isFetching}
              variant="secondary"
              size="sm"
              class="w-full"
              on:click={() => $query.fetchNextPage()}
            >
              {#if $query.isFetching}
                <LoaderCircleIcon class="mr-2 h-3 w-3 animate-spin" />
              {/if}
              {$LL.common.loadMore()}
            </Button>
          {/if}
        {/if}
      </div>
    </div>
    <div class="mt-2 flex w-full items-center justify-between px-2 py-0.5">
      {#if !shareId}
        {#if !(field.required && !option) && !readonly}
          <Button variant="outline" size="xs" on:click={onCreateRecord}>
            <PlusIcon class="text-muted-foreground mr-2 h-3 w-3 font-semibold" />
            {$LL.table.record.create()}
          </Button>
        {:else}
          <div class="h-6"></div>
        {/if}
      {/if}

      {#if $query.isFetchedAfterMount}
        <p class="text-muted-foreground text-xs">
          {$query.data?.pages.flatMap((r) => r.records).length} / {$query.data?.pages[0]?.total}
          {$LL.table.record.labels()}
        </p>
      {/if}
    </div>
  {/if}
</div>

{#if option && $hasPermission("field:update")}
  <Dialog.Root bind:open={updateOptionDialogOpen} portal="body">
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>{$LL.table.field.select.option.update()}</Dialog.Title>
      </Dialog.Header>

      <form on:submit|preventDefault={() => updateOption()}>
        <OptionEditor bind:name={option.name} bind:color={option.color} />
        <Button type="submit" disabled={$updateFieldMutation.isPending} class="mt-2 w-full">
          {$LL.table.field.select.option.update()}
        </Button>
      </form>
    </Dialog.Content>
  </Dialog.Root>
{/if}

{#if option && $hasPermission("field:update")}
  <AlertDialog.Root bind:open={deleteOptionDialogOpen} portal="body">
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>
          {$LL.table.field.select.option.delete()}
          <Option {option} />
        </AlertDialog.Title>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
        <AlertDialog.Action asChild let:builder>
          <Button builders={[builder]} variant="destructive" on:click={() => deleteOption()}>
            <TrashIcon class="mr-2 size-4" />
            {$LL.common.delete()}
          </Button>
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{/if}
