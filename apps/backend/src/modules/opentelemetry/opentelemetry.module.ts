import { opentelemetry } from "@elysiajs/opentelemetry"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node"
import { singleton } from "@undb/di"
import Elysia from "elysia"

@singleton()
export class OpenTelemetryModule {
  plugin() {
    return new Elysia().use(
      opentelemetry({
        spanProcessors: [
          new BatchSpanProcessor(
            new OTLPTraceExporter({
              url: "https://api.axiom.co/v1/traces",
              headers: {
                Authorization: `Bearer ${Bun.env.AXIOM_TOKEN}`,
                "X-Axiom-Dataset": Bun.env.AXIOM_DATASET,
              },
            }),
          ),
        ],
      }),
    )
  }
}
