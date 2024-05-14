<script lang="ts">
  import FieldPicker from "../field-picker/field-picker.svelte"

  export let value: string | undefined
</script>

<FieldPicker bind:value {...$$restProps} />
