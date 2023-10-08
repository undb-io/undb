<script lang="ts">
	import { cn } from '$lib/utils'
	import type { IQueryTable } from '@undb/core'

	export let table: IQueryTable
	export let active = false
</script>

<li class="pl-3">
	<a
		href={`/t/${table.id}`}
		class={cn(
			active
				? 'bg-primary/5 text-primary dark:text-gray-50 dark:bg-gray-600'
				: 'text-gray-700 hover:text-primary hover:bg-primary/5  dark:text-gray-200 dark:hover:bg-gray-600',
			'group/table flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
		)}
	>
		<span
			class={cn(
				active
					? 'bg-primary/5 text-primary dark:text-gray-50 dark:bg-gray-600'
					: 'text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-200 dark:hover:text-gray-200 dark:bg-gray-500',

				'border-gray-200 group-hover/table:border-primary group-hover/table:text-primary dark:border-white dark:group-hover/table:border-gray-50 dark:group-hover/table:text-gray-50 transition',
				'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white ',
			)}
		>
			{table.name.slice(0, 1)}
		</span>
		<span class="truncate">{table.name}</span>
	</a>
</li>
