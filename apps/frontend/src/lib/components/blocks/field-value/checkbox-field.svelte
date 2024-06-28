<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox"

  export let value: boolean | undefined = undefined
</script>

<Checkbox class={$$restProps.class} checked={value} disabled></Checkbox>
