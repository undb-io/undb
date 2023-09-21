import type { Button as ButtonPrimitive } from 'bits-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import Root from './button.svelte'

const buttonVariants = tv({
	base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:text-white',
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
			destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
			outline:
				'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground bg-white dark:bg-gray-600',
			secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline',
		},
		size: {
			default: 'h-9 px-4 py-2',
			xs: 'h-5 rounded-md px-1 text-xs',
			sm: 'h-8 rounded-md px-3 text-xs',
			lg: 'h-10 rounded-md px-8',
			icon: 'h-9 w-9',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
})

type Variant = VariantProps<typeof buttonVariants>['variant']
type Size = VariantProps<typeof buttonVariants>['size']

type Props = ButtonPrimitive.Props & {
	variant?: Variant
	size?: Size
}

type Events = ButtonPrimitive.Events

export {
	//
	Root as Button,
	buttonVariants,
	Root,
	type Events as ButtonEvents,
	type Props as ButtonProps,
	type Events,
	type Props,
}
