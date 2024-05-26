<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import EmptyForms from "./empty-forms.svelte"

  const table = getTable()
  $: forms = $table.forms
</script>

{#if !forms?.value.length}
  <EmptyForms />
{:else}{/if}
