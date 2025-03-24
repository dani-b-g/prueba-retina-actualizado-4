import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import {
  ATTR_SERVICE_NAME,
  ATTR_NETWORK_PEER_ADDRESS,
  ATTR_NETWORK_PROTOCOL_NAME,
  ATTR_NETWORK_PROTOCOL_VERSION,
} from '@opentelemetry/semantic-conventions';

const exporter = new OTLPMetricExporter({
  url: 'http://localhost:4318/v1/metrics',
});

// NOTE: https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv
const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'app-service-name',
  [ATTR_NETWORK_PEER_ADDRESS]: 'localhost',
  [ATTR_NETWORK_PROTOCOL_NAME]: 'http',
  [ATTR_NETWORK_PROTOCOL_VERSION]: '1.0',
  app: 'angular-frontend',
});

// Configurar el MeterProvider
const meterProvider = new MeterProvider({
  resource,
  readers: [
    new PeriodicExportingMetricReader({
      exporter,
      exportIntervalMillis: 10000, // cada 10 segundo
    }),
  ],
});

// Exporta el meter para usarlo en toda la app
export const meter = meterProvider.getMeter('angular-metrics');
