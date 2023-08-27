<script lang="ts">
	import { isImage, type IAttachmentFieldValue } from '@undb/core'
	import { CloseButton, Fileupload } from 'flowbite-svelte'
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

<Fileupload bind:files multiple {...$$restProps} disabled={readonly} />
{#if value?.length}
	<div class="flex gap-1 h-20 mt-2">
		{#each value ?? [] as attachment, index}
			<div class="relative h-full flex group">
				{#if isImage(attachment)}
					<img src={attachment.url} alt={attachment.name} />
				{:else}
					<span>{attachment.name}</span>
				{/if}

				<CloseButton
					class="absolute top-0 right-0 translate-y-[-50%] translate-x-[50%] hidden group-hover:block"
					on:click={() => remove(index)}
				/>
			</div>
		{/each}
	</div>
{/if}
