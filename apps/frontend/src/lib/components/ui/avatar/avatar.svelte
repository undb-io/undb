<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui'
	import { cn } from '$lib/utils'
	import { avatarVariants, type Size } from '.'

	type $$Props = AvatarPrimitive.Props & {
		size?: Size
	}

	let className: $$Props['class'] = undefined
	export let delayMs: $$Props['delayMs'] = undefined
	export let size: $$Props['size'] = 'default'
	export { className as class }
</script>

<AvatarPrimitive.Root {delayMs} class={cn(avatarVariants({ size, className }))} {...$$restProps}>
	<slot />
</AvatarPrimitive.Root>
