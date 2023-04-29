<script lang="ts">
	import { getExtension, type AttachmentFieldValue, isImage } from '@undb/core'
	import { Img } from 'flowbite-svelte'

	export let value: AttachmentFieldValue
	$: attachments = value.unpack()
</script>

<div class="flex">
	{#each attachments as attachment}
		{@const extension = getExtension(attachment.mimeType)}
		{#if extension}
			{@const img = isImage(attachment)}
			{#if img}
				<Img src={`/public/${attachment.token}_${attachment.name}`} alt={attachment.name} />
			{:else}
				{extension}
			{/if}
		{/if}
	{/each}
</div>
