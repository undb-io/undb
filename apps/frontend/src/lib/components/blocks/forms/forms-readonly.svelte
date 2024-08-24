<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import * as Resizable from "$lib/components/ui/resizable"
  import { formId } from "$lib/store/tab.store"
  import FormReadonly from "./form-readonly.svelte"
  import { cn } from "$lib/utils"
  import { ClipboardTypeIcon } from "lucide-svelte"
  export let table = getTable()

  $: forms = $table.forms?.forms ?? []
</script>

<main class="h-full w-full">
  <Resizable.PaneGroup direction="horizontal">
    <Resizable.Pane defaultSize={25} maxSize={30} minSize={20}>
      <ul class="h-full w-full space-y-3 px-2 py-4">
        {#each forms as form}
          {@const active = $formId === form.id || (!$formId && form.id === forms[0].id)}
          <button
            on:click={() => ($formId = form.id)}
            class={cn(
              "flex w-full items-center rounded-md border px-4 py-2  shadow-sm ring-offset-current transition-all duration-300 ease-out",
              active && "ring-primary font-semibold shadow-inner ring-1 ring-offset-1",
            )}
          >
            <ClipboardTypeIcon class="mr-2 h-4 w-4" />
            {form.name}
          </button>
        {/each}
      </ul>
    </Resizable.Pane>
    <Resizable.Handle />
    <Resizable.Pane defaultSize={75}>
      <FormReadonly />
    </Resizable.Pane>
  </Resizable.PaneGroup>
</main>
