import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

// Configura el exportador OTLP con la URL de tu backend de trazas
const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4320/v1/traces', 
});

// Crea el proveedor de trazas y añade el procesador de spans
const traceProvider = new WebTracerProvider({
    spanProcessors:[new BatchSpanProcessor(exporter)]
});
traceProvider.register();

// Registra las instrumentaciones automáticas
registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation(),
    new XMLHttpRequestInstrumentation(),
    new UserInteractionInstrumentation(),
  ],
});
