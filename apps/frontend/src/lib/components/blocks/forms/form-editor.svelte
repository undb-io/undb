<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable"

  import FormHeader from "./form-header.svelte"
  import FormDisplay from "./form-display.svelte"
  import { getTable } from "$lib/store/table.store"

  const table = getTable()
  $: forms = $table.forms
  $: form = forms?.props?.[0]
</script>

<FormHeader />
<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane defaultSize={70}>
    {#if form}
      <FormDisplay {form} />
    {/if}
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={30}>
    <Resizable.PaneGroup direction="vertical">
      <Resizable.Pane defaultSize={50}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Two</span>
        </div>
      </Resizable.Pane>
      <Resizable.Handle />
      <Resizable.Pane defaultSize={50}>
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Three</span>
        </div>
      </Resizable.Pane>
    </Resizable.PaneGroup>
  </Resizable.Pane>
</Resizable.PaneGroup>
