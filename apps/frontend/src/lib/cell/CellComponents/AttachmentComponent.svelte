<script lang="ts">
	import { getExtension, isImage, type IAttachmentFieldValue } from '@undb/core'
	import { Img } from 'flowbite-svelte'

	export let value: IAttachmentFieldValue
</script>

<div class="flex h-full space-x-2">
	{#each value as attachment}
		{@const extension = getExtension(attachment.mimeType)}
		{#if extension}
			{@const img = isImage(attachment)}
			{#if img}
				<Img src={attachment.url} alt={attachment.name} />
			{:else}
				{extension}
			{/if}
		{/if}
	{/each}
</div>
