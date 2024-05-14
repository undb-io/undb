<script lang="ts">
  import type { ComponentType } from "svelte"
  import NumberIcon from "./number-icon.svelte"
  import StringIcon from "./string-icon.svelte"

  export let type: string

  const map: Record<string, ComponentType> = {
    string: StringIcon,
    number: NumberIcon,
  }
</script>

<svelte:component this={map[type]} {...$$restProps} />
