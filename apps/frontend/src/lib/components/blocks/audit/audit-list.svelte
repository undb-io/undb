<script lang="ts">
  import { format } from "timeago.js"
  import { GetRecordAuditsStore } from "$houdini"
  import { browser } from "$app/environment"
  import AuditListItem from "./audit-list-item.svelte"

  export let recordId: string

  $: store = new GetRecordAuditsStore()
  $: browser && store.fetch({ variables: { recordId }, policy: "NetworkOnly" })

  $: audits = ($store.data?.recordAudits ?? []).filter((a) => !!a)
</script>

<div class="my-4 px-2">
  {#if $store.fetching}
    <!-- TODO -->
  {:else if !audits.length}
    <!-- TODO -->
  {:else}
    <div class="space-y-2">
      {#each audits as audit}
        {#if audit.op === "record.created"}
          <div class="text-muted-foreground flex items-center justify-between text-xs">
            <span>
              created by {audit.operator.username}
            </span>
            <span>
              {format(audit.timestamp)}
            </span>
          </div>
        {:else if audit.op === "record.updated"}
          <div class="text-muted-foreground flex items-center justify-between text-xs">
            <span>
              updated by {audit.operator.username}
            </span>
            <span>
              {format(audit.timestamp)}
            </span>
          </div>

          {#if audit.detail}
            <AuditListItem {audit} />
          {/if}
        {/if}
      {/each}
    </div>
  {/if}
</div>
