<script lang="ts">
	import { t } from '$lib/i18n'
	import { cn } from '$lib/utils'
	export let value: (string | null)[] = []
	$: content = value.filter(Boolean).toString()
</script>

<span
	class={cn(
		'bg-gray-200 text-gray-600 border border-gray-300 dark:border-gray-950 text-xs px-2.5 py-0.5 rounded whitespace-nowrap dark:bg-gray-600 dark:text-gray-200',
		!content && '!text-gray-400  font-normal',
	)}
>
	{content || $t('unnamed', { ns: 'common' })}
</span>
