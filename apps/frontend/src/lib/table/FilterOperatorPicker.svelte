<script lang="ts">
	import cx from 'classnames'
	import { getFilterOperators } from '$lib/field/helpers'
	import type { Field } from '@undb/core'
	import { Button, Dropdown, Radio } from 'flowbite-svelte'
	import { t } from '$lib/i18n'

	let open = false
	export let value: string = ''
	export let field: Field | undefined

	$: data = getFilterOperators(field?.type)
	$: if (!!field && !data.some((v) => v.value === value)) {
		value = data[0]?.value ?? ''
	}
</script>

<Button
	color="alternative"
	{...$$restProps}
	class={cx($$restProps.class, 'gap-2 field_picker text-xs')}
	on:click={() => (open = true)}
>
	{$t(value, { ns: 'common' })}
</Button>
{#if data.length}
	<Dropdown
		style="z-index: 999999999;"
		class="w-[400px] z-[99999] border rounded-sm bg-white shadow-sm dark:shadow-gray-500 dark:bg-gray-700"
		bind:open
	>
		{#each data as item}
			{@const selected = item.value === value}
			<Radio value={item.value} bind:group={value} custom on:change={() => (open = false)}>
				<li
					role="listitem"
					class="w-full pr-4 flex justify-between hover:bg-gray-100 transition cursor-pointer dark:text-white dark:hover:!text-gray-600"
					class:bg-gray-100={selected}
				>
					<div
						class={cx(
							'px-3 py-2 inline-flex gap-2 items-center text-xs text-gray-600 dark:text-white dark:hover:text-gray-600',
							selected ? 'dark:!text-gray-600' : '',
						)}
					>
						{$t(item.value, { ns: 'common' })}
					</div>
					<span>
						{#if selected}
							<i class="ti ti-check text-sm dark:text-gray-600" />
						{/if}
					</span>
				</li>
			</Radio>
		{/each}
	</Dropdown>
{/if}
