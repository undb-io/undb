<script lang="ts">
  export let value: number | Date | undefined | null
</script>

<div {...$$restProps}>{value}</div>
