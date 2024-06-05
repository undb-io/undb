<script lang="ts">
  export let value: string
  export let displayValue: string | undefined
</script>

<span data-field-value={value} class={$$restProps.class}>
  {displayValue}
</span>
