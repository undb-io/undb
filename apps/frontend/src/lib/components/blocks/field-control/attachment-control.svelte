<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"
  import { getTable } from "$lib/store/table.store"
  import type { AttachmentField, IAttachmentFieldValue } from "@undb/table"
  import { FileIcon, XIcon } from "lucide-svelte"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import { isNumber } from "radash"

  export let field: AttachmentField
  const table = getTable()

  export let value: IAttachmentFieldValue = []
  export let readonly = false

  async function onChange(e: Event) {
    const target = e.target as HTMLInputElement
    const files = target.files
    if (!files?.length) return

    const [file] = files

    const formData = new FormData()
    formData.append("files", file)

    const response = await fetch(`/api/upload/${$table.id.value}`, {
      method: "POST",
      body: formData,
    })

    const json: { id: string; url: string; mimeType: string }[] = await response.json()
    if (json.length) {
      const [data] = json

      value = [
        ...(value ?? []),
        {
          id: data.id,
          url: data.url,
          type: data.mimeType,
          name: file.name,
          size: file.size,
        },
      ]
    }
  }

  function removeFile(index: number) {
    value = value.filter((_, i) => i !== index)
  }

  function swap(oldIndex: number, newIndex: number) {
    const newValue = [...value]
    const [removed] = newValue.splice(oldIndex, 1)
    newValue.splice(newIndex, 0, removed)
    value = newValue
  }
</script>

{#if Array.isArray(value)}
  <div class="space-y-2">
    <SortableList
      class=""
      animation={200}
      onEnd={(event) => {
        if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
          swap(event.oldIndex, event.newIndex)
        }
      }}
    >
      {#each value as v, i (v.id)}
        <div class="flex items-center" data-attachment-id={v.id} data-field-id={field.id.value}>
          <FileIcon class="text-muted-foreground mr-2 h-5 w-5" />
          <span class="flex-1">
            {v.name}
          </span>
          <button on:click={() => removeFile(i)} class="rounded-full p-2 transition-colors hover:bg-gray-100">
            <XIcon class="text-muted-foreground h-5 w-5" />
          </button>
        </div>
      {/each}
    </SortableList>
  </div>
{/if}
<Input {...$$restProps} type="file" on:change={onChange} disabled={readonly} />
