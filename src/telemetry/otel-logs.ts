import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { ATTR_NETWORK_PEER_ADDRESS, ATTR_NETWORK_PROTOCOL_NAME, ATTR_NETWORK_PROTOCOL_VERSION, ATTR_SERVICE_NAME,  } from '@opentelemetry/semantic-conventions';
import { resourceFromAttributes } from "@opentelemetry/resources";

// OPCIONAL: Diagnóstico en consola
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);


// NOTE: https://github.com/open-telemetry/opentelemetry-js/blob/main/semantic-conventions/README.md#unstable-semconv
const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]:'app-angular-service',
  [ATTR_NETWORK_PEER_ADDRESS]:'localhost',
  [ATTR_NETWORK_PROTOCOL_NAME]:'http',
  [ATTR_NETWORK_PROTOCOL_VERSION]:'1.0',
  app:'angular-frontend'
})

// Configurar exporter
const exporter = new OTLPLogExporter({
  url: 'http://localhost:4318/v1/logs', // Cambia por tu endpoint real
});

// Crear LoggerProvider
const loggerProvider = new LoggerProvider({resource});
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(exporter));

// Simplemente exportas el logger para usarlo
export const logger = loggerProvider.getLogger('angular-logger');
