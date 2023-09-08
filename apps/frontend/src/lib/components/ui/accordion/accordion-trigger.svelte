<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui'
	import { cn } from '$lib/utils'

	type $$Props = AccordionPrimitive.TriggerProps
	type $$Events = AccordionPrimitive.TriggerEvents

	let className: $$Props['class'] = undefined
	export let level: AccordionPrimitive.HeaderProps['level'] = 3
	export { className as class }
</script>

<AccordionPrimitive.Header {level} class="flex">
	<AccordionPrimitive.Trigger
		class={cn(
			'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 dark:text-white',
			className,
		)}
		{...$$restProps}
		on:click
	>
		<slot />
		<i class="ti ti-chevron-down"></i>
	</AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
