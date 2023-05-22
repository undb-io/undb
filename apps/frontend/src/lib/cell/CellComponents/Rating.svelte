<script lang="ts">
	import cx from 'classnames'
	import type { RatingField, RatingFieldValue } from '@undb/core'

	export let value: RatingFieldValue | undefined
	export let field: RatingField

	$: rating = value?.unpack() ?? 0
</script>

<div class="flex items-center">
	{#each Array(field.max) as _, index}
		<i
			class={cx(
				'ti ti-star-filled w-4 h-4 inline-flex items-center justify-center',
				index < rating ? ' text-yellow-400' : ' text-gray-300 dark:text-gray-500',
			)}
		/>
	{/each}
</div>
