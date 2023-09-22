<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import type { TreeField } from '@undb/core'
	import TreeConfig from './TreeConfig.svelte'
	import TreeView from './TreeView.svelte'
	import * as Card from '$lib/components/ui/card'

	const table = getTable()
	const view = getView()

	$: fieldId = $view.treeFieldIdString
	$: field = fieldId ? ($table.schema.getFieldById(fieldId).into() as TreeField | undefined) : undefined
</script>

{#if field}
	<TreeView {field} />
{:else}
	<div class="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-slate-800/80">
		<Card.Root class="w-96">
			<Card.Header>
				<TreeConfig />
			</Card.Header>
		</Card.Root>
	</div>
{/if}
