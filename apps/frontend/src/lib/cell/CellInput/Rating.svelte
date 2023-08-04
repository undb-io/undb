<script lang="ts">
	import cx from 'classnames'
	import type { RatingField } from '@undb/core'
	import { Radio } from 'flowbite-svelte'
	export let value: number = 0
	export let field: RatingField
	export let readonly = false

	$: max = field.max

	let overIndex: number | undefined = undefined

	const onMouseLeave = (e: MouseEvent) => {
		if (readonly) return
		overIndex = undefined
	}

	const onMouseOver = (index: number) => {
		if (readonly) return
		overIndex = index
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={cx('h-full flex items-center', $$restProps.class)} on:mouseleave={onMouseLeave}>
	<!-- svelte-ignore a11y-interactive-supports-focus -->
	{#each Array(max) as _, i}
		<Radio disabled={readonly} value={i + 1} bind:group={value} custom class="group" readonly={$$restProps.readonly}>
			<!-- svelte-ignore a11y-mouse-events-have-key-events -->
			<!-- svelte-ignore a11y-interactive-supports-focus -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span
				class={cx('inline-flex items-center justify-center w-5 h-5 transition', { 'hover:scale-125': !readonly })}
				role="button"
				on:mouseover={() => onMouseOver(i)}
			>
				<i
					class={cx('ti ti-star-filled inline-block text-gray-300 transition group-focus:!text-red-500')}
					class:text-yellow-400={(overIndex === undefined && value > i) || (overIndex !== undefined && overIndex >= i)}
				/>
			</span>
		</Radio>
	{/each}
</div>
