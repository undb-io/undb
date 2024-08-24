<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import EmptyForms from "./empty-forms.svelte"
  import FormEditor from "./form-editor.svelte"
  import FormsReadonly from "./forms-readonly.svelte"
  import { hasPermission } from "$lib/store/space-member.store"

  const table = getTable()
  $: forms = $table.forms

  export let readonly = false
</script>

{#if !forms?.value.length}
  <EmptyForms />
{:else if readonly || !$hasPermission("form:update")}
  <FormsReadonly />
{:else}
  <FormEditor />
{/if}
