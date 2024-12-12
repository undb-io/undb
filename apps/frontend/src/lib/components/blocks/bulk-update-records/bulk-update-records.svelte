<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { getTable } from "$lib/store/table.store"
  import { cn } from "$lib/utils"
  import {
    FieldIdVo,
    parseValidViewFilter,
    type IViewFilterGroup,
    type IViewFilterOptionSchema,
    type MaybeConditionGroup,
  } from "@undb/table"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js"
  import FieldControl from "../field-control/field-control.svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zod, zodClient } from "sveltekit-superforms/adapters"
  import { trpc } from "$lib/trpc/client"
  import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query"
  import { objectify, pick } from "radash"
  import { toast } from "svelte-sonner"
  import * as Form from "$lib/components/ui/form"
  import * as Alert from "$lib/components/ui/alert/index.js"
  import { PencilIcon } from "lucide-svelte"
  import type { IBulkUpdateRecordsCommand, IBulkUpdateRecordsCommandOutput } from "@undb/commands"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import FiltersEditor from "../filters-editor/filters-editor.svelte"
  import { writable, type Writable } from "svelte/store"
  import autoAnimate from "@formkit/auto-animate"
  import type { Readable } from "svelte/store"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"

  const table = getTable()
  export let viewId: Readable<string | undefined>
  const mutableFields = $table.schema.mutableFields
  const schema = $table.schema.getMutableSchema()
  export let r: Writable<string | null>

  let open = false

  export let customFilter = false
  export let filter: IViewFilterGroup | undefined = undefined
  export let onSuccess: (data: IBulkUpdateRecordsCommandOutput) => void = () => {}

  let selectedFieldIds: string[] = []
  $: selectedFields = selectedFieldIds.map((id) => $table.schema.getFieldById(new FieldIdVo(id)).unwrap())

  const client = useQueryClient()

  const dataService = getDataService()

  const updateRecordMutation = createMutation({
    mutationFn: async (command: IBulkUpdateRecordsCommand) => {
      return dataService.records.updateRecords(command)
    },
    onSuccess: async (data) => {
      if (!data.modifiedCount) {
        toast.warning($LL.table.record.bulkUpdate.noRecordsUpdated())
      } else {
        toast.success($LL.table.record.bulkUpdate.recordsUpdated({ count: data.modifiedCount }))
      }
      reset({})
      await client.invalidateQueries({ queryKey: ["records", $table.id.value] })
      onSuccess(data)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const updateRecords = async (values: any) => {
    const selectedSchema = $table.schema.getMutableSchema(selectedFields)
    const validated = await form.validateForm({
      update: true,
      schema: zod(selectedSchema),
      focusOnError: true,
    })

    if (validated.valid) {
      $updateRecordMutation.mutate({
        tableId: $table.id.value,
        filter,
        values,
      })
    }
  }

  const form = superForm(defaults({}, zodClient(schema)), {
    SPA: true,
    dataType: "json",
    validators: zodClient(schema),
    resetForm: false,
    invalidateAll: false,
    onUpdate(event) {
      if (!event.form.valid) {
        return
      }

      open = true
    },
  })

  const { form: formData, enhance, allErrors, tainted, reset, errors } = form
  $: values = selectedFieldIds.length
    ? pick(
        {
          ...objectify(
            selectedFieldIds,
            (f) => f,
            () => null,
          ),
          ...$formData,
        },
        selectedFieldIds,
      )
    : undefined

  const value = writable<MaybeConditionGroup<IViewFilterOptionSchema> | undefined>()
  $: validValue = $value ? parseValidViewFilter($table.schema, $value) : undefined
  $: if (validValue && !customFilter) {
    filter = validValue
  }
</script>

<div class="grid h-full grid-cols-4">
  <div class="col-span-3 flex h-full flex-col border-r px-4 py-3">
    {#if !customFilter}
      <div class="space-y-2">
        <p class="font-semibold">{$LL.table.record.bulkUpdate.updateWithCondition()}</p>
        <FiltersEditor
          bind:value={$value}
          table={$table}
          class={cn("rounded-md border bg-gray-50 shadow-inner", filter && "pt-4")}
        ></FiltersEditor>
      </div>
    {/if}

    <div use:autoAnimate class="my-4 flex h-full flex-1 flex-col space-y-4">
      {#if !selectedFields.length}
        <div class="flex-1">
          <Alert.Root>
            <PencilIcon class="h-4 w-4" />
            <Alert.Title>{$LL.table.record.bulkUpdate.addField()}</Alert.Title>
            <Alert.Description>{$LL.table.record.bulkUpdate.selectColumns()}</Alert.Description>
          </Alert.Root>
        </div>
      {:else}
        <div use:autoAnimate class="flex-1 space-y-4">
          {#each selectedFields as field}
            {@const dirty = $tainted && $tainted[field.id.value]}
            <Form.Field class="space-y-2" {form} name={field.id.value}>
              <Form.Control let:attrs>
                <Form.Label class="h-full w-48 space-y-2">
                  <div class="flex items-center gap-2">
                    <FieldIcon {field} type={field.type} class="size-3" />
                    <span class="truncate text-sm">{field.name.value}</span>
                    {#if dirty}
                      <span
                        class="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        {$LL.table.record.bulkUpdate.updated()}
                      </span>
                    {/if}
                  </div>
                </Form.Label>
                <div class="flex-1">
                  <FieldControl
                    {...attrs}
                    bind:value={$formData[field.id.value]}
                    {field}
                    {r}
                    tableId={$table.id.value}
                    class={cn($errors[field.id.value] && "border-red-500 focus-visible:ring-0")}
                  />
                  <Form.FieldErrors class="mt-2" />
                </div>
              </Form.Control>
            </Form.Field>
          {/each}
        </div>
      {/if}
      <div class="-mx-4 flex justify-end border-t py-2 pt-4">
        <Button
          size="sm"
          disabled={!selectedFields.length}
          class="mr-5"
          on:click={() => {
            open = true
          }}
        >
          <PencilIcon class="mr-2 h-4 w-4" />
          {$LL.table.record.bulkUpdate.button()}
        </Button>
      </div>
    </div>
  </div>

  <div class="col-span-1 h-full px-3 py-3">
    <ScrollArea class="h-full">
      <p class="text-muted-foreground mb-2 font-normal">{$LL.table.record.bulkUpdate.selectColumns()}</p>
      <div class="mb-2 flex w-full items-center gap-2">
        <Button
          class="flex-1"
          size="sm"
          variant="outline"
          on:click={() => (selectedFieldIds = mutableFields.map((f) => f.id.value))}
        >
          {$LL.table.record.bulkUpdate.selectAll()}
        </Button>
        <Button size="sm" class="flex-1" variant="outline" on:click={() => (selectedFieldIds = [])}>
          {$LL.table.record.bulkUpdate.removeAll()}
        </Button>
      </div>
      <div class="space-y-2">
        {#each mutableFields as field}
          {@const selected = selectedFieldIds.includes(field.id.value)}
          <Button
            variant={selected ? "secondary" : "outline"}
            class={cn("w-full justify-start shadow-sm")}
            on:click={() => {
              selectedFieldIds.includes(field.id.value)
                ? (selectedFieldIds = selectedFieldIds.filter((f) => f !== field.id.value))
                : (selectedFieldIds = [...selectedFieldIds, field.id.value])
            }}
          >
            <FieldIcon class="mr-2 h-4 w-4" {field} type={field.type} />
            {field.name.value}
          </Button>
        {/each}
      </div>
    </ScrollArea>
  </div>
</div>

<AlertDialog.Root bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{$LL.table.record.bulkUpdate.title()}</AlertDialog.Title>
      <AlertDialog.Description>{$LL.table.record.bulkUpdate.description()}</AlertDialog.Description>
    </AlertDialog.Header>
    {#if !filter}
      <Alert.Root class="border-yellow-300 bg-yellow-50 text-yellow-700">
        <Alert.Description>{$LL.table.record.bulkUpdate.noFilterAlert()}</Alert.Description>
      </Alert.Root>
    {/if}
    <AlertDialog.Footer>
      <AlertDialog.Cancel>{$LL.common.cancel()}</AlertDialog.Cancel>
      <AlertDialog.Action
        on:click={() => {
          if (values) {
            updateRecords(values)
          }
        }}
      >
        {$LL.table.record.bulkUpdate.continue()}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
