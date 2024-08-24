<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { formId } from "$lib/store/tab.store"
  import FormDisplay from "$lib/components/blocks/forms/form-display.svelte"

  const table = getTable()

  $: form = $formId ? $table.forms?.getFormById($formId) : $table.forms?.forms[0]
</script>

{#if form}
  <FormDisplay readonly {form} />
{/if}
