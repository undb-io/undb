<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"
  import { getTable } from "$lib/store/table.store"
  import type { IAttachmentFieldValue } from "@undb/table"

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
        ...value,
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
</script>

{#each value as v}
  {v.id}
  {v.name}
{/each}
<Input {...$$restProps} type="file" on:change={onChange} disabled={readonly} />
