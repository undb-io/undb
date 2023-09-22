import { Dialog as DialogPrimitive } from 'bits-ui'

const Root = DialogPrimitive.Root
const Trigger = DialogPrimitive.Trigger

import Content from './dialog-content.svelte'
import Description from './dialog-description.svelte'
import Footer from './dialog-footer.svelte'
import Header from './dialog-header.svelte'
import Overlay from './dialog-overlay.svelte'
import Portal from './dialog-portal.svelte'
import Title from './dialog-title.svelte'

export {
	Content,
	Description,
	//
	Root as Dialog,
	Content as DialogContent,
	Description as DialogDescription,
	Footer as DialogFooter,
	Header as DialogHeader,
	Overlay as DialogOverlay,
	Portal as DialogPortal,
	Title as DialogTitle,
	Trigger as DialogTrigger,
	Footer,
	Header,
	Overlay,
	Portal,
	Root,
	Title,
	Trigger,
}
