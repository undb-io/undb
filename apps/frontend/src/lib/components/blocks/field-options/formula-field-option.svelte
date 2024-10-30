<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js"
  import FormulaEditor from "$lib/components/formula/formula-editor.svelte"
  import { FormulaField, type IFormulaFieldOption } from "@undb/table"

  export let option: IFormulaFieldOption = {
    fn: "",
  }

  export let field: FormulaField | undefined = undefined
</script>

<div class="space-y-2">
  <div class="space-y-1">
    <Label for="Formula" class="text-xs font-normal">Formula</Label>
  </div>
  <FormulaEditor bind:value={option.fn} {field} />
</div>
