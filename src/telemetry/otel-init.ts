import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_NETWORK_PEER_ADDRESS,
  ATTR_NETWORK_PROTOCOL_NAME,
  ATTR_NETWORK_PROTOCOL_VERSION,
} from '@opentelemetry/semantic-conventions';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader, MeterProvider } from '@opentelemetry/sdk-metrics';
import { onCLS, onLCP, onINP } from 'web-vitals';

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'app-angular-service',
  [ATTR_NETWORK_PEER_ADDRESS]: 'localhost',
  [ATTR_NETWORK_PROTOCOL_NAME]: 'http',
  [ATTR_NETWORK_PROTOCOL_VERSION]: '1.0',
  app: 'angular-frontend',
});
// Token obtenido tras el flujo de login (guardado en localStorage)
const token = localStorage.getItem('auth_token');
// Configura el exportador OTLP con la URL de tu backend de trazas
const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});
// ==== METRICS PROVIDER ====

const metricExporter = new OTLPMetricExporter({
  url: 'http://localhost:4318/v1/metrics',
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 5000,
});

const meterProvider = new MeterProvider({
  resource: resource,
  readers: [metricReader],
});


// Crea el proveedor de trazas y añade el procesador de spans
const traceProvider = new WebTracerProvider({
  resource,
  spanProcessors: [new BatchSpanProcessor(exporter)],
});
traceProvider.register({ contextManager: new ZoneContextManager() });

// WEB-VITALS
const webVitalMeter = meterProvider.getMeter('web-vitals');

function sendWebVital(name: string, value: number) {
  const gauge = webVitalMeter.createObservableGauge(name, {
    description: `Web Vital ${name}`,
  });

  gauge.addCallback((observableResult) => {
    observableResult.observe(value);
  });
}

onCLS((metric) => sendWebVital('cls', metric.value));
onLCP((metric) => sendWebVital('lcp', metric.value));
onINP((metric) => sendWebVital('inp', metric.value));



// Registra las instrumentaciones automáticas
registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation(),
    new XMLHttpRequestInstrumentation(),
    new UserInteractionInstrumentation(),
  ],meterProvider:meterProvider,
  tracerProvider:traceProvider
});
