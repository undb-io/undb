<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { COLS, widgeItems } from '$lib/store/widge'
	import { trpc } from '$lib/trpc/client'
	import { Button } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()

	const createWidge = trpc().table.view.dashboard.createWidge.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const add = async () => {
		const newItem = widgeItems.add()
		const itemLayout = newItem[COLS]
		const { x, y, h, w } = itemLayout
		const layout = { x, y, h, w }

		$createWidge.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			widge: {
				layout,
				virsualization: {
					name: $t('virsualization count'),
					type: 'number',
				},
			},
		})
	}
</script>

<Button size="xs" on:click={add} outline class="h-full !rounded-md items-center whitespace-nowrap flex gap-2">
	<i class="ti ti-plus" />
	<span>
		{$t('add widge')}
	</span>
</Button>
