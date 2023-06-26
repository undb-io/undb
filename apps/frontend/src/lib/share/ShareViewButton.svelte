<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { Button } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()

	const shareView = trpc().share.create.mutation()
</script>

<Button
	on:click={() => {
		$shareView.mutate({
			tableId: $table.id.value,
			targetId: $view.id.value,
			targetType: 'view',
		})
	}}>share</Button
>
