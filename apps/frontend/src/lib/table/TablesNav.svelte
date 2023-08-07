<script lang="ts">
	import cx from 'classnames'
	import type { IQueryTable } from '@undb/core'
	import { page } from '$app/stores'

	export let tables: IQueryTable[]
</script>

<ul class="-mx-2 space-y-1 pb-2">
	{#each tables as table}
		{@const active = table.id === $page.params.tableId}
		<li>
			<a
				href={`/t/${table.id}`}
				class={cx(
					active
						? 'bg-blue-50 text-indigo-600 dark:text-gray-50 dark:bg-gray-700'
						: 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50  dark:text-gray-200 dark:hover:bg-gray-700',
					'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
				)}
			>
				<span
					class={cx(
						active
							? 'bg-blue-50 text-indigo-600 dark:text-gray-50 dark:bg-gray-700 '
							: 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:text-gray-200 dark:bg-gray-700',

						' border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white dark:group-hover:border-gray-50 dark:group-hover:text-gray-50',
						'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white ',
					)}
				>
					{table.name.slice(0, 1)}
				</span>
				<span class="truncate">{table.name}</span>
			</a>
		</li>
	{/each}
</ul>
