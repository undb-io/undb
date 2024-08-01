<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import EmptyForms from "./empty-forms.svelte"
  import FormEditor from "./form-editor.svelte"

  const table = getTable()
  $: forms = $table.forms
</script>

{#if !forms?.value.length}
  <EmptyForms />
{:else}
  <FormEditor />
{/if}
