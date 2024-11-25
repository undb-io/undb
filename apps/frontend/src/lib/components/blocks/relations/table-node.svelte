<script lang="ts">
  import type { TableDo } from "@undb/table"
  import { Node, Anchor } from "svelvet"
  import * as Table from "$lib/components/ui/table"
  import FieldIcon from "../field-icon/field-icon.svelte"
  import { LL } from "@undb/i18n/client"

  export let table: TableDo
  export let position: { x: number; y: number } | undefined = undefined
</script>

<Node useDefaults id={table.id.value} {position}>
  <div class="px-2 py-1 text-lg font-semibold">
    {table.name.value}
  </div>
  <Table.Root>
    <Table.Row class="relative">
      <Table.Cell class="font-medium">{$LL.common.name()}</Table.Cell>
      <Table.Cell class="inline-flex items-center gap-2">{$LL.common.type()}</Table.Cell>
    </Table.Row>
    {#each table.schema.fields as field}
      <Table.Row class="relative">
        <Table.Cell class="font-medium">
          {field.name.value}

          <div class="absolute -left-2 top-3">
            {#if field.type === "reference"}
              {@const foreignTableId = field.foreignTableId}
              {#if foreignTableId}
                {#if !field.symmetricFieldId}
                  <Anchor id={field.id.value} output connections={[foreignTableId]} direction="west" />
                {:else}
                  <Anchor
                    id={field.id.value}
                    connections={[[foreignTableId, field.symmetricFieldId ?? ""]]}
                    direction="south"
                  />
                {/if}
              {/if}
            {/if}
          </div>
        </Table.Cell>
        <Table.Cell class="inline-flex items-center gap-2">
          <FieldIcon type={field.type} {field} class="h-4 w-4" />
          <span>
            {$LL.table.fieldTypes[field.type]()}
          </span>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Root>
</Node>
