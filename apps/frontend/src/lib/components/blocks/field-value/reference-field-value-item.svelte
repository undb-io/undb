<script lang="ts">
  export let value: string
</script>

<span
  class="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
>
  {value}
  <slot />
</span>
