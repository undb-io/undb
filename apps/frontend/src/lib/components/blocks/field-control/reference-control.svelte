<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte"
  import type { ReferenceField } from "@undb/table"
  import { foreignTableId } from "../reference/foreign-table-picker.store"

  export let field: ReferenceField

  const onClick = () => {
    $foreignTableId = field.foreignTableId
  }
</script>

<Button on:click={onClick} size="icon">+</Button>
