import "reflect-metadata"

import { trpc } from "$lib/trpc/client"
import { TRPC_CLIENT } from "@undb/data-service"
import { container } from "@undb/di"

container.register(TRPC_CLIENT, { useValue: trpc })

export const ssr = false
export const prerender = true
