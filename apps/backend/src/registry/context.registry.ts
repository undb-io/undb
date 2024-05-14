import { CONTEXT_TOKEN } from "@undb/context"
import { executionContext } from "@undb/context/server"
import { container } from "@undb/di"

export const registerContext = () => {
  container.register(CONTEXT_TOKEN, { useValue: executionContext })
}
