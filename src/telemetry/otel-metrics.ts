import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const exporter = new OTLPMetricExporter({
  url: 'http://localhost:4320/v1/metrics', 
});

// Configurar el MeterProvider
const meterProvider = new MeterProvider({
  readers: [
    new PeriodicExportingMetricReader({
      exporter,
      exportIntervalMillis: 1000, // cada 1 segundo
    }),
  ],
});

// Exporta el meter para usarlo en toda la app
export const meter = meterProvider.getMeter('angular-metrics');
