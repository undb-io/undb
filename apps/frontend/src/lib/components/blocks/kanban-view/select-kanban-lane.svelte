<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import Sortable from "sortablejs"
  import { createInfiniteQuery, createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { FieldIdVo, RecordDO, Records, SelectEqual, SelectField, type IOption, type IRecordsDTO } from "@undb/table"
  import KanbanSkeleton from "./kanban-skeleton.svelte"
  import { derived, type Readable } from "svelte/store"
  import { getTable } from "$lib/store/table.store"
  import KanbanCard from "./kanban-card.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { EllipsisIcon, GripVerticalIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-svelte"
  import { CREATE_RECORD_MODAL, toggleModal } from "$lib/store/modal.store"
  import { defaultRecordValues } from "$lib/store/records.store"
  import { getRecordsStore } from "$lib/store/records.store"
  import { Some } from "@undb/domain"
  import { inview } from "svelte-inview"
  import { cn } from "$lib/utils"
  import { hasPermission } from "$lib/store/space-member.store"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import * as Dialog from "$lib/components/ui/dialog"
  import Option from "../option/option.svelte"
  import OptionEditor from "../option/option-editor.svelte"
  import { toast } from "svelte-sonner"
  import { invalidate } from "$app/navigation"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"

  const table = getTable()
  const recordsStore = getRecordsStore()

  export let tableId: string
  export let viewId: Readable<string>
  export let fieldId: string
  export let field: SelectField
  export let option: IOption | null
  export let readonly = false
  export let shareId: string | undefined = undefined

  const getRecords = ({ pageParam = 1 }) => {
    if (shareId) {
      return trpc.shareData.records.query({
        shareId,
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

    return trpc.record.list.query({
      tableId,
      viewId: $viewId,
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

  const query = createInfiniteQuery({
    queryKey: [$table.id.value, $viewId, fieldId, "getRecords", option?.id],
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
      recordsStore.invalidateRecord($table, variables.id)
    },
  })

  const updateFieldMutation = createMutation({
    mutationFn: trpc.table.field.update.mutate,
    onSuccess: async (data, variables, context) => {
      toast.success("Option updated")
      updateOptionDialogOpen = false
      await invalidate(`table:${$table.id.value}`)
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

  onMount(() => {
    if (!shareId && !readonly) {
      new Sortable(laneElement, {
        group: "shared",
        animation: 150,
        sort: false,
        dataIdAttr: "data-record-id",
        ghostClass: "bg-gray-100",
        onEnd: (evt) => {
          const recordId = evt.item.dataset.recordId
          if (!recordId) return
          const optionId = evt.to.dataset.optionId ?? null

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

  $: {
    const records = ($query.data?.pages.flatMap((r: any) => r.records) as IRecordsDTO) ?? []
    recordsStore.upsertRecords(Records.fromJSON($table, records))
  }

  let storeGetRecords = recordsStore.getRecords
  $: recordDos = $storeGetRecords(Some(new SelectEqual(option?.id ?? null, new FieldIdVo(fieldId))))

  $: fields = $table.getOrderedVisibleFields($viewId) ?? []

  let updateOptionDialogOpen = false
  let deleteOptionDialogOpen = false
</script>

<div
  data-option-id={option?.id ?? null}
  class="kanban-lane flex w-[350px] shrink-0 flex-col space-y-2 rounded-sm px-2 pt-2 transition-all"
>
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
        <Option option={{ id: "", name: "No Option", color: "gray" }} />
      {/if}
    </div>

    {#if !shareId && !readonly && option}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button size="xs" variant="ghost" builders={[builder]}>
            <EllipsisIcon class="text-muted-foreground h-4 w-4" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-48">
          <DropdownMenu.Group>
            <DropdownMenu.Item class="text-muted-foreground text-xs" on:click={() => (updateOptionDialogOpen = true)}>
              <PencilIcon class="mr-2 h-3 w-3" />
              Update option
            </DropdownMenu.Item>
            <DropdownMenu.Item
              disabled={field.options.length <= 1}
              class="text-muted-foreground text-xs"
              on:click={() => (deleteOptionDialogOpen = true)}
            >
              <TrashIcon class="mr-2 h-3 w-3" />
              Delete option
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    {/if}
  </div>
  <div class="max-w-[350px] flex-1 space-y-2 overflow-auto" data-option-id={option?.id ?? null}>
    <div
      bind:this={laneElement}
      data-option-id={option?.id ?? null}
      class="min-h-[200px] space-y-2 rounded-lg border bg-gray-100 p-2"
    >
      {#if !readonly && $hasPermission("record:create")}
        <Button
          on:click={() => {
            $defaultRecordValues = {
              [fieldId]: option ? option.id : null,
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
        {#each recordDos as record (record.id.value)}
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
</div>

{#if option}
  <Dialog.Root bind:open={updateOptionDialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Update option</Dialog.Title>
      </Dialog.Header>

      <form on:submit|preventDefault={() => updateOption()}>
        <OptionEditor bind:name={option.name} bind:color={option.color} />
        <Button type="submit" disabled={$updateFieldMutation.isPending} class="mt-2 w-full">Update</Button>
      </form>
    </Dialog.Content>
  </Dialog.Root>
{/if}

{#if option}
  <AlertDialog.Root bind:open={deleteOptionDialogOpen}>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Delete Option <Option {option} /></AlertDialog.Title>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action on:click={() => deleteOption()}>Continue</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{/if}
