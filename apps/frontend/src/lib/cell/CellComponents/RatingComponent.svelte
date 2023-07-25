<script lang="ts">
	import cx from 'classnames'
	export let value: number | undefined
	export let max: number
</script>

<div class="flex items-center">
	{#each Array(max) as _, index}
		<i
			class={cx(
				'ti ti-star-filled w-4 h-4 inline-flex items-center justify-center',
				index < (value ?? 0) ? ' text-yellow-400' : ' text-gray-300 dark:text-gray-500',
			)}
		/>
	{/each}
</div>
