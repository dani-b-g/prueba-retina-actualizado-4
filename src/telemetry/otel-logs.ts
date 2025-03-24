import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// OPCIONAL: Diagnóstico en consola
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);

// Configurar exporter
const exporter = new OTLPLogExporter({
  url: 'http://localhost:4320/v1/logs', // Cambia por tu endpoint real
});

// Crear LoggerProvider
const loggerProvider = new LoggerProvider();
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(exporter));

// Simplemente exportas el logger para usarlo
export const logger = loggerProvider.getLogger('angular-logger');
