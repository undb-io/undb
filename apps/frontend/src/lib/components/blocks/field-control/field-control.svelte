<script lang="ts">
  import type { Field, FieldType } from "@undb/table"
  import IdControl from "./id-control.svelte"
  import StringControl from "./string-control.svelte"
  import NumberControl from "./number-control.svelte"
  import type { ComponentType } from "svelte"

  export let field: Field

  export let value: any

  const map: Record<FieldType, ComponentType> = {
    id: IdControl,
    string: StringControl,
    number: NumberControl,
  }
</script>

<svelte:component this={map[field.type]} bind:value {...$$restProps} />
