<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable"

  import FormDisplay from "./form-display.svelte"
  import FormFieldsEditor from "./form-fields-editor.svelte"
  import { getTable } from "$lib/store/table.store"
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte"
  import { formId } from "$lib/store/tab.store"
  import FormOption from "./form-option.svelte"

  const table = getTable()
  $: forms = $table.forms
  $: form = $formId ? forms?.props.find((f) => f.id === $formId) : forms?.props?.[0]
</script>

<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane defaultSize={70}>
    {#if form}
      <FormDisplay bind:form />
    {/if}
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={30}>
    <Resizable.PaneGroup direction="vertical">
      <Resizable.Pane defaultSize={50}>
        {#if form}
          <ScrollArea class="h-full w-full">
            <FormFieldsEditor bind:form />
          </ScrollArea>
        {/if}
      </Resizable.Pane>
      <Resizable.Handle withHandle />
      <Resizable.Pane defaultSize={50}>
        {#if form}
          <FormOption bind:form />
        {/if}
      </Resizable.Pane>
    </Resizable.PaneGroup>
  </Resizable.Pane>
</Resizable.PaneGroup>
