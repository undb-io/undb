<script lang="ts">
  import FormulaEditor from "$lib/components/formula/formula-editor.svelte"
  import { FormulaField, type IFormulaFieldOption } from "@undb/table"

  export let option: IFormulaFieldOption = {
    fn: "",
  }

  export let field: FormulaField | undefined = undefined
</script>

<div class="space-y-2">
  <FormulaEditor bind:value={option.fn} {field} />
</div>
