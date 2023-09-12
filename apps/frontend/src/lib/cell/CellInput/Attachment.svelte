<script lang="ts">
	import FileInput from '$components/ui/input/file-input.svelte'
	import { isImage, type IAttachmentFieldValue } from '@undb/core'
	let files: FileList

	export let value: IAttachmentFieldValue = []
	export let readonly = false

	async function upload(formData: FormData) {
		const response = await fetch('/api/attachment/upload', {
			method: 'POST',
			body: formData,
		})
		return response.json()
	}

	async function handFiles(files: FileList) {
		// TODO: upload batch
		const data = await Promise.all(
			[...files].map((file) => {
				const formData = new FormData()
				formData.set('file', file)
				return upload(formData)
			}),
		)

		value = [...value, ...data]
	}

	const remove = (index: number) => {
		value = value.filter((_, i) => i !== index)
	}

	$: if (files) {
		handFiles(files)
	}
</script>

<FileInput type="file" multiple bind:files class={$$restProps.class} disabled={readonly} />
{#if value?.length}
	<div class="flex gap-1 h-20 mt-2">
		{#each value ?? [] as attachment, index}
			<div class="relative h-full flex group">
				{#if isImage(attachment)}
					<img src={attachment.url} alt={attachment.name} />
				{:else}
					<span>{attachment.name}</span>
				{/if}

				<button
					class="absolute top-0 right-0 translate-y-[-50%] translate-x-[50%] hidden group-hover:block"
					on:click={() => remove(index)}
				>
					<i class="ti ti-x"></i>
				</button>
			</div>
		{/each}
	</div>
{/if}
