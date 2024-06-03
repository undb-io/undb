<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import type { IAuditDTO } from "@undb/audit"
  import { FieldIdVo } from "@undb/table"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"
  import { format } from "timeago.js"

  const table = getTable()

  export let recordId: string

  const getAudits = createQuery({
    queryKey: ["table", $table.id.value, "record", recordId, "audits"],
    queryFn: () => trpc.record.audits.list.query({ recordId }),
  })

  // @ts-expect-error ignore audits type
  $: audits = ($getAudits.data?.audits ?? []) as IAuditDTO[]
</script>

<div class="px-2">
  {#if $getAudits.isLoading}
    <!-- TODO -->
  {:else if !audits.length}
    <!-- TODO -->
  {:else}
    <div class="space-y-2">
      {#each audits as audit}
        {#if audit.op === "record.created"}
          <div class="text-muted-foreground flex items-center justify-between text-xs">
            <span>
              Record created by {audit.operatorId} on
            </span>
            <span>
              {format(audit.timestamp)}
            </span>
          </div>
        {:else if audit.op === "record.updated"}
          <div class="text-muted-foreground flex items-center justify-between text-xs">
            <span>
              Record updated by {audit.operatorId} on
            </span>
            <span>
              {format(audit.timestamp)}
            </span>
          </div>

          {#if audit.detail}
            {@const previousValues = audit.detail.previousValues}
            {@const newValues = audit.detail.values}
            <div class="bg-muted space-y-1 rounded-sm p-2 text-sm shadow-inner">
              {#each Object.entries(newValues) as [fieldId, value]}
                {@const field = $table.schema.getFieldById(new FieldIdVo(fieldId)).into(undefined)}
                {#if field}
                  {@const previousValue = previousValues[fieldId]}
                  <div class="text-muted-foreground flex items-center gap-2">
                    <FieldIcon type={field.type} class="h-3 w-3" />
                    {field.name.value}
                  </div>
                  {#if previousValue}
                    <div>
                      <span class="border border-red-200 bg-red-100 px-1">
                        {previousValue}
                      </span>
                    </div>
                  {/if}
                  <div>
                    <span class="border border-green-200 bg-green-100 px-1">
                      {value}
                    </span>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        {/if}
      {/each}
    </div>
  {/if}
</div>
