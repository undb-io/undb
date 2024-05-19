import Layout from "../layout"
import { Test } from "./test"

export const UI = () => {
  return (
    <Layout>
      <>
        <button
          class="focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
          hx-get="/app/test/1"
          hx-swap="outerHTML"
          hx-target="this"
        >
          click me
        </button>
      </>
    </Layout>
  )
}
