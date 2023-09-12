<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'
	import { buttonVariants, type ButtonProps } from '$lib/components/ui/button'
	import { cn } from '$lib/utils'

	type $$Props = AlertDialogPrimitive.ActionProps & { variant?: ButtonProps['variant'] }

	export let variant: $$Props['variant'] = 'default'

	let className: $$Props['class'] = undefined
	export { className as class }
</script>

<AlertDialogPrimitive.Action class={cn(buttonVariants({ variant }), className)} on:click {...$$restProps}>
	<slot />
</AlertDialogPrimitive.Action>
