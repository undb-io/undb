<script lang="ts">
	import type { IAttachmentFieldValue } from '@undb/core'
	import { Fileupload } from 'flowbite-svelte'
	let files: FileList

	export let value: IAttachmentFieldValue[] = []

	async function upload(formData: FormData) {
		const response = await fetch('/api/attachment/upload', {
			method: 'POST',
			body: formData,
		})
		return response.json()
	}

	async function handFiles(files: FileList) {
		// TODO: load batch
		const data = await Promise.all(
			[...files].map((file) => {
				const formData = new FormData()
				formData.set('file', file)
				return upload(formData)
			}),
		)

		value = data
	}

	$: if (files) {
		handFiles(files)
	}
</script>

<Fileupload bind:files multiple />
