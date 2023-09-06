import { tv, type VariantProps } from 'tailwind-variants'
import Fallback from './avatar-fallback.svelte'
import Image from './avatar-image.svelte'
import Root from './avatar.svelte'

export const avatarVariants = tv({
	base: 'relative flex shrink-0 overflow-hidden rounded-full',
	variants: {
		size: {
			lg: 'h-10 w-10',
			default: 'h-7 w-7',
			sm: 'h-5 w-5 text-xs',
		},
	},
	defaultVariants: {
		size: 'default',
	},
})

export type Size = VariantProps<typeof avatarVariants>['size']

export {
	//
	Root as Avatar,
	Fallback as AvatarFallback,
	Image as AvatarImage,
	Fallback,
	Image,
	Root,
}
