<script lang="ts">
  import type { Field } from "@undb/table"
  import FieldIcon from "$lib/components/blocks/field-icon/field-icon.svelte"

  export let field: Field
</script>

<div class="flex items-center gap-1">
  <FieldIcon type={field.type} class="h-4 w-4" />
  <span>
    {field.name.value}
  </span>
</div>
