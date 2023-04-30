<script lang="ts">
	import cx from 'classnames'
	import type { RatingField } from '@undb/core'
	export let value: number = 0
	export let field: RatingField

	$: max = field.max

	let overIndex: number | undefined = undefined

	const onMouseLeave = (e: MouseEvent) => {
		overIndex = undefined
	}

	const onMouseOver = (index: number) => {
		overIndex = index
	}
	const onClick = (index: number) => {
		value = index + 1
	}
</script>

<div class={cx('h-full flex items-center', $$restProps.class)} on:mouseleave={onMouseLeave}>
	<!-- svelte-ignore a11y-interactive-supports-focus -->
	{#each Array(max) as _, i}
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<!-- svelte-ignore a11y-interactive-supports-focus -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<span
			class="inline-flex items-center justify-center w-5 h-5 transition hover:scale-125"
			role="button"
			on:mouseover={() => onMouseOver(i)}
			on:click={() => onClick(i)}
		>
			<i
				class={cx('ti ti-star-filled inline-block text-gray-300 transition')}
				class:text-yellow-400={(overIndex === undefined && value > i) || (overIndex !== undefined && overIndex >= i)}
			/>
		</span>
	{/each}
</div>
