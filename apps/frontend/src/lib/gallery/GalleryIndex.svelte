<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import GalleryConfig from './GalleryConfig.svelte'
	import GalleryView from './GalleryView.svelte'
	import * as Card from '$lib/components/ui/card'
	import type { AttachmentField } from '@undb/core'

	const table = getTable()
	const view = getView()

	$: fieldId = $view.galleryFieldIdString
	$: field = fieldId ? ($table.schema.getFieldById(fieldId).into() as AttachmentField | undefined) : undefined
</script>

{#if field}
	<GalleryView {field} />
{:else}
	<div class="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-slate-800/80">
		<Card.Root class="w-96">
			<Card.Header>
				<GalleryConfig />
			</Card.Header>
		</Card.Root>
	</div>
{/if}
