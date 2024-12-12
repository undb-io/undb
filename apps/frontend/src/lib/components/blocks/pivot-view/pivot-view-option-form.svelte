<script lang="ts">
  import * as Form from "$lib/components/ui/form"
  import { getTable } from "$lib/store/table.store"
  import { isValidColumnLabel, isValidRowLabel, updatePivotViewDTO, type PivotView } from "@undb/table"
  import FieldPicker from "../field-picker/field-picker.svelte"
  import { defaults, superForm } from "sveltekit-superforms"
  import { zodClient } from "sveltekit-superforms/adapters"
  import { trpc } from "$lib/trpc/client"
  import { createMutation } from "@tanstack/svelte-query"
  import { toast } from "svelte-sonner"
  import { ArrowDownUpIcon } from "lucide-svelte"
  import { invalidate } from "$app/navigation"
  import PivotAggregatePicker from "./pivot-aggregate-picker.svelte"
  import { derived } from "svelte/store"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { LL } from "@undb/i18n/client"
  import { getDataService } from "$lib/store/data-service.store"
  import { type IUpdateViewCommand } from "@undb/commands"

  const table = getTable()
  export let readonly = false
  export let onSuccess: (() => void) | undefined = undefined

  let columnFields = derived(table, ($table) => $table.schema.getPivotFields("column"))
  let rowFields = derived(table, ($table) => $table.schema.getPivotFields("row"))

  export let view: PivotView

  const form = superForm(
    defaults(
      {
        tableId: $table.id.value,
        viewId: view.id.value,
        type: "pivot",
        name: view.name.value,
        pivot: view.pivot.unwrapOrElse(() => ({
          columnLabel: $columnFields.at(0)?.id.value,
          rowLabel: $rowFields.at(0)?.id.value,
          value: $table.schema.getPivotValueFields("sum").at(0)?.id.value,
          aggregate: view.pivotAggregate.unwrapOr("sum"),
        })),
      },
      zodClient(updatePivotViewDTO),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zodClient(updatePivotViewDTO),
      resetForm: false,
      invalidateAll: false,
      onUpdate(event) {
        if (!event.form.valid) return

        $updateViewMutation.mutate(event.form.data)
      },
    },
  )

  const { enhance, form: formData } = form

  $: columnLabel = $formData.pivot?.columnLabel
  $: rowLabel = $formData.pivot?.rowLabel

  $: columnField = $columnFields.find((f) => f.id.value === columnLabel)
  $: rowField = $rowFields.find((f) => f.id.value === rowLabel)

  $: swapEnabled =
    columnField &&
    rowField &&
    columnField.id.value !== rowField.id.value &&
    isValidColumnLabel(rowField) &&
    isValidRowLabel(columnField)

  const dataService = getDataService()

  const updateViewMutation = createMutation({
    mutationFn: dataService.table.view.updateView,
    mutationKey: ["updateView"],
    async onSuccess(data, variables, context) {
      toast.success($LL.table.view.updated())
      await invalidate(`undb:table:${$table.id.value}`)
      onSuccess?.()
    },
  })
</script>

<div class="space-y-2">
  <form id="select-pivot-field-form" class="space-y-2" use:enhance>
    <div class="grid w-full items-center gap-4">
      <div class="flex flex-col space-y-1.5">
        <Form.Field {form} name="pivot.columnLabel">
          <Form.Control let:attrs>
            <Form.Label>{$LL.table.view.pivot.columnLabel()}</Form.Label>
            <FieldPicker
              {...attrs}
              placeholder={$LL.table.view.pivot.selectField()}
              value={$formData.pivot?.columnLabel}
              disabled={readonly}
              class="w-full"
              onValueChange={(field) => {
                if ($formData.pivot) {
                  $formData.pivot.columnLabel = field
                } else {
                  $formData.pivot = { columnLabel: field }
                }
              }}
              filter={(f) => $columnFields.map((f) => f.id.value).includes(f.id) && f.id !== $formData.pivot?.rowLabel}
            />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="pivot.rowLabel">
          <Form.Control let:attrs>
            <div class="flex items-center justify-between">
              <Form.Label>{$LL.table.view.pivot.rowLabel()}</Form.Label>
              {#if !readonly}
                <Tooltip.Root portal="body">
                  <Tooltip.Trigger>
                    <button
                      type="button"
                      disabled={!swapEnabled}
                      on:click={() => {
                        if (!$formData.pivot) return
                        const columnLabel = $formData.pivot?.columnLabel
                        const rowLabel = $formData.pivot?.rowLabel

                        $formData.pivot.columnLabel = rowLabel
                        $formData.pivot.rowLabel = columnLabel
                      }}
                    >
                      <ArrowDownUpIcon class="text-muted-foreground mr-2 h-4 w-4 font-semibold" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <p>{$LL.table.view.pivot.swap()}</p>
                  </Tooltip.Content>
                </Tooltip.Root>
              {/if}
            </div>
            <FieldPicker
              {...attrs}
              placeholder={$LL.table.view.pivot.selectField()}
              value={$formData.pivot?.rowLabel}
              disabled={readonly}
              class="w-full"
              filter={(f) => $rowFields.map((f) => f.id.value).includes(f.id) && f.id !== $formData.pivot?.columnLabel}
              onValueChange={(field) => {
                if ($formData.pivot) {
                  $formData.pivot.rowLabel = field
                } else {
                  $formData.pivot = { rowLabel: field }
                }
              }}
            />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="pivot.aggregate">
          <Form.Control let:attrs>
            <Form.Label>{$LL.table.view.pivot.aggregate()}</Form.Label>
            <PivotAggregatePicker
              {...attrs}
              disabled={readonly}
              value={$formData.pivot?.aggregate}
              class="w-full text-left"
              onValueChange={(v) => {
                if ($formData.pivot) {
                  $formData.pivot.aggregate = v
                  if (v === "count") {
                    $formData.pivot.value = undefined
                  }
                } else {
                  if (v !== "count") {
                    $formData.pivot = { aggregate: v }
                  }
                }
              }}
            />
          </Form.Control>
          <Form.Description />
          <Form.FieldErrors />
        </Form.Field>

        {#if $formData.pivot?.aggregate !== "count"}
          <Form.Field {form} name="pivot.value">
            <Form.Control let:attrs>
              <Form.Label>{$LL.table.view.pivot.value()}</Form.Label>
              <FieldPicker
                {...attrs}
                placeholder={$LL.table.view.pivot.selectField()}
                value={$formData.pivot?.value}
                disabled={readonly}
                class="w-full"
                filter={(f) => {
                  const valueFields = $table.schema.getPivotValueFields($formData.pivot?.aggregate ?? "sum")
                  return valueFields.map((f) => f.id.value).includes(f.id)
                }}
                onValueChange={(field) => {
                  if ($formData.pivot) {
                    $formData.pivot.value = field
                  } else {
                    $formData.pivot = { value: field }
                  }
                }}
              />
            </Form.Control>
            <Form.Description />
            <Form.FieldErrors />
          </Form.Field>
        {/if}

        {#if !readonly}
          <Form.Button disabled={$updateViewMutation.isPending} class="w-full">{$LL.common.save()}</Form.Button>
        {/if}
      </div>
    </div>
  </form>
</div>
