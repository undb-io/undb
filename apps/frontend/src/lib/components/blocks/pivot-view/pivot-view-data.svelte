<script lang="ts">
  import type { PivotView, SelectField, StringField, UserField } from "@undb/table"
  import { createQuery } from "@tanstack/svelte-query"
  import { trpc } from "$lib/trpc/client"
  import { getTable } from "$lib/store/table.store"
  import * as Table from "$lib/components/ui/table"
  import Option from "$lib/components/blocks/option/option.svelte"
  import UserFieldComponent from "$lib/components/blocks/field-value/user-field.svelte"

  const table = getTable()
  export let view: PivotView
  export let readonly: boolean = false
  export let shareId: string | undefined

  const getPivotData = createQuery({
    queryKey: ["pivot-data", $table.id.value, view.id.value],
    queryFn: () => {
      if (shareId) {
        return trpc.shareData.pivot.query({
          shareId,
          tableId: $table.id.value,
          viewId: view.id.value,
        })
      }
      return trpc.record.pivot.query({
        tableId: $table.id.value,
        viewId: view.id.value,
      })
    },
  })

  $: result = ($getPivotData.data as any) ?? []
  $: columnFieldId = view.columnLabel.unwrap()!
  $: rowFieldId = view.rowLabel.unwrap()!
  $: valueFieldId = view.value.unwrap()!
  $: aggregate = view.pivotAggregate.unwrapOr("count")

  $: columnField = $table.schema.getFieldByIdOrName(columnFieldId).into(undefined) as SelectField | undefined
  $: rowField = $table.schema.getFieldByIdOrName(rowFieldId).into(undefined) as
    | SelectField
    | StringField
    | UserField
    | undefined
  $: valueField = $table.schema.getFieldByIdOrName(valueFieldId).into(undefined)
  $: options = columnField?.options ?? []

  $: data = result.slice(0, -1)
  $: total = result[result.length - 1]
</script>

<main class="h-full w-full">
  {#if columnField && rowField}
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-[200px] border-r bg-gray-50 text-left font-semibold">
            {rowField.name.value}
          </Table.Head>
          {#each options as option}
            <Table.Head class="border-r bg-gray-50 text-right">
              <Option {option} class="ml-auto" />
            </Table.Head>
          {/each}
          <Table.Head class="border-r bg-gray-50 text-right font-semibold"
            >{aggregate?.toUpperCase() ?? "Total"} ({rowField.name.value})</Table.Head
          >
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#if $getPivotData.isPending}
          {#each Array(10) as _}
            <Table.Row>
              <Table.Cell class="border-r bg-gray-50">
                <div class="h-4 w-32 animate-pulse rounded bg-slate-200" />
              </Table.Cell>
              {#each options as _}
                <Table.Cell class="border-r text-right">
                  <div class="ml-auto h-4 w-16 animate-pulse rounded bg-slate-200" />
                </Table.Cell>
              {/each}
              <Table.Cell class="border-r bg-gray-50 text-right">
                <div class="ml-auto h-4 w-16 animate-pulse rounded bg-slate-200" />
              </Table.Cell>
            </Table.Row>
          {/each}
        {:else}
          {#each data as row}
            {@const rowTotal = row["agg"]}
            {@const label = row.label}
            {@const labelValues = row.labelValues}
            <Table.Row>
              <Table.Cell class="border-r bg-gray-50 font-semibold">
                {#if label === null}
                  (Is Empty)
                {:else if rowField.type === "select"}
                  {@const optionId = label}
                  {@const option = rowField.options.find((o) => o.id === optionId)}
                  {#if option}
                    <Option {option} />
                  {/if}
                {:else if rowField.type === "user"}
                  <UserFieldComponent value={label} displayValue={labelValues} />
                {:else}
                  {label}
                {/if}
              </Table.Cell>
              {#each options as option}
                {@const value = row.values[option.name]}
                <Table.Cell class="border-r text-right">
                  {#if value}
                    {#if valueField?.type === "currency" && aggregate !== "count"}
                      <span class="text-xs text-gray-800">{valueField.symbol}</span>
                    {/if}
                    <span class="text-xs text-gray-800">{value}</span>
                  {:else}
                    <div class="ml-auto h-2 w-7 rounded-sm bg-slate-200"></div>
                  {/if}
                </Table.Cell>
              {/each}
              <Table.Cell class="border-r bg-gray-50 text-right">
                {#if valueField?.type === "currency" && aggregate !== "count"}
                  <span class="text-xs text-gray-800">{valueField.symbol}</span>
                {/if}
                <span class="text-xs text-gray-800">{rowTotal}</span>
              </Table.Cell>
            </Table.Row>
          {/each}
          {#if total}
            <Table.Row>
              <Table.Cell class="border-r bg-gray-50 font-semibold"
                >{aggregate?.toUpperCase() ?? "Total"} ({columnField.name.value})</Table.Cell
              >
              {@const totalRowTotal = total["agg"]}
              {#each options as option}
                {@const value = total.values[option.name]}
                <Table.Cell class="border-r bg-gray-50 text-right">
                  {#if value}
                    {#if valueField?.type === "currency" && aggregate !== "count"}
                      <span class="text-xs text-gray-800">{valueField.symbol}</span>
                    {/if}
                    <span class="text-xs text-gray-800">{value}</span>
                  {:else}
                    <div class="ml-auto h-2 w-7 rounded-sm bg-slate-200"></div>
                  {/if}
                </Table.Cell>
              {/each}
              <Table.Cell class="border-r bg-gray-50 text-right">
                {#if valueField?.type === "currency" && aggregate !== "count"}
                  <span class="text-sm text-gray-800">{valueField.symbol}</span>
                {/if}

                <span class="text-sm text-gray-800">{totalRowTotal}</span>
              </Table.Cell>
            </Table.Row>
          {/if}
        {/if}
      </Table.Body>
    </Table.Root>
  {/if}
</main>
