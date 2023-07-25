<script lang="ts">
	import AttachmentComponent from '$lib/cell/CellComponents/AttachmentComponent.svelte'
	import type { IBaseFieldEventSchema, IAttachmentReadableValueSchema } from '@undb/core'
	import { differenceBy } from 'lodash-es'

	export let field: IBaseFieldEventSchema
	export let previousValue: IAttachmentReadableValueSchema | undefined
	export let value: IAttachmentReadableValueSchema | undefined
	$: removed = differenceBy(previousValue, value ?? [], 'id')
	$: added = differenceBy(value, previousValue ?? [], 'id')
</script>

<div class="text-sm space-y-2 flex flex-wrap h-20">
	{#if removed?.length}
		<div class="h-full line-through rounded-sm p-2 bg-red-200/50 border-red-200 inline-flex items-center gap-2">
			<AttachmentComponent value={removed} />
		</div>
	{/if}
	{#if added?.length}
		<div class="h-full rounded-sm p-2 bg-green-200/50 border-green-200 inline-flex items-center gap-2">
			<AttachmentComponent value={added} />
		</div>
	{/if}
</div>
