<script lang="ts">
	import Calendar from '@toast-ui/calendar'
	import '@toast-ui/calendar/dist/toastui-calendar.min.css'

	let el: HTMLDivElement | undefined

	$: if (el) {
		const calendar = new Calendar(el, {
			usageStatistics: false,
		})
	}
</script>

<div bind:this={el} class="h-full w-full"></div>
