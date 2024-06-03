<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import RlsList from "./rls-list.svelte"
  import EmptyRls from "./empty-rls.svelte"
  import CreateRlsDialog from "./create-rls-dialog.svelte"

  const table = getTable()

  $: hasRls = $table.getHasRLS()
</script>

{#if hasRls}
  <RlsList />
{:else}
  <EmptyRls />
{/if}

<CreateRlsDialog />
