<script lang="ts">
  import Input from "$lib/components/ui/input/input.svelte"
  import { isImage, type AttachmentField, type IAttachmentFieldValue, type IPresign } from "@undb/table"
  import { FileIcon, XIcon, LoaderCircleIcon } from "lucide-svelte"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import { isNumber } from "radash"
  import { selectedAttachment } from "$lib/store/attachment.store"

  export let field: AttachmentField
  export let onValueChange: (value: IAttachmentFieldValue) => void

  export let value: IAttachmentFieldValue = []
  export let readonly = false

  $: max = field.max
  $: disabled = (value?.length ?? 0) >= max

  let isUploading = false

  async function onChange(e: Event) {
    try {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (!files?.length) return

      const [file] = files

      isUploading = true
      const signatureResponse = await fetch("/api/signature", {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, mimeType: file.type }),
      })

      const signature = await signatureResponse.json()

      const { url, id, token, name } = signature as IPresign
      // local
      if (url.startsWith("/")) {
        const formData = new FormData()
        formData.append("name", name)
        formData.append("file", file)
        await fetch(url, {
          method: "PUT",
          body: formData,
        })
      } else {
        await fetch(url, {
          method: "PUT",
          body: file,
        })
      }

      const uploaded = await fetch(`/api/files/${name}/uploaded`, {
        method: "POST",
        body: JSON.stringify({ id, token, url: url.split("?")[0], size: file.size, mimeType: file.type }),
      })

      const { signedUrl } = await uploaded.json()
      isUploading = false
      value = [
        ...(value ?? []),
        {
          id: id,
          url: url.split("?")[0],
          token,
          type: file.type,
          name,
          size: file.size,
          signedUrl,
        },
      ]
      onValueChange?.(value)
    } catch (error) {
      console.error(error)
    } finally {
      isUploading = false
    }
  }

  function removeFile(index: number) {
    value = value?.filter((_, i) => i !== index) ?? []
  }

  function swap(oldIndex: number, newIndex: number) {
    const newValue = [...(value ?? [])]
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
        <div class="flex items-center gap-2" data-attachment-id={v.id} data-field-id={field.id.value}>
          <div class="flex h-5 w-5 items-center justify-center">
            {#if isImage(v)}
              <button on:click={() => ($selectedAttachment = v)}>
                <img src={v.signedUrl} alt={v.name} />
              </button>
            {:else}
              <FileIcon class="text-muted-foreground h-5 w-5" />
            {/if}
          </div>
          <span class="text-muted-foreground flex-1 text-sm">
            {v.name}
          </span>
          <button on:click={() => removeFile(i)} class="rounded-full p-2 transition-colors hover:bg-gray-100">
            <XIcon class="text-muted-foreground h-5 w-5" />
          </button>
        </div>
      {/each}
    </SortableList>
    {#if isUploading}
      <div class="flex items-center gap-2 pb-2">
        <LoaderCircleIcon class="text-muted-foreground size-4 animate-spin" />
        <span class="text-muted-foreground text-sm">Uploading...</span>
      </div>
    {/if}
  </div>
{/if}
<Input {...$$restProps} type="file" on:change={onChange} disabled={readonly || disabled || isUploading} />
