import { Injectable } from '@angular/core';
import { logger } from '../../telemetry/otel-logs';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { trace, context } from '@opentelemetry/api';

@Injectable({ providedIn: 'root' })
export class LoggerService {

  logInfo(message: string, attributes: Record<string, any> = {}, associateWithTrace = true) {
    this.log(message, SeverityNumber.INFO, attributes, associateWithTrace);
  }

  logWarn(message: string, attributes: Record<string, any> = {}, associateWithTrace = true) {
    this.log(message, SeverityNumber.WARN, attributes, associateWithTrace);
  }

  logError(message: string, attributes: Record<string, any> = {}, associateWithTrace = true) {
    this.log(message, SeverityNumber.ERROR, attributes, associateWithTrace);
  }

  // Clásico método tuyo, mantenido
  logWithTrace(message: string, ...optionalParams: any[]) {
    const span = trace.getSpan(context.active());
    if (span) {
      const { traceId, spanId } = span.spanContext();
      console.log(`[traceId: ${traceId}, spanId: ${spanId}] ${message}`, ...optionalParams);
    } else {
      console.log(message, ...optionalParams);
    }
  }

  // Método común que envía log a OTEL + consola
  private log(
    message: string,
    severity: SeverityNumber,
    attributes: Record<string, any>,
    associateWithTrace: boolean
  ) {
    let enrichedAttributes = { ...attributes };

    if (associateWithTrace) {
      const span = trace.getSpan(context.active());
      if (span) {
        const spanContext = span.spanContext();
        enrichedAttributes = {
          ...enrichedAttributes,
          traceId: spanContext.traceId,
          spanId: spanContext.spanId,
        };
      }
    }

    // Emitir a OpenTelemetry Collector
    logger.emit({
      severityNumber: severity,
      severityText: SeverityNumber[severity],
      body: message,
      attributes: enrichedAttributes,
    });

    // Además log a consola (opcional, útil en dev)
    switch (severity) {
      case SeverityNumber.INFO:
        console.info(`[INFO] ${message}`, enrichedAttributes);
        break;
      case SeverityNumber.WARN:
        console.warn(`[WARN] ${message}`, enrichedAttributes);
        break;
      case SeverityNumber.ERROR:
        console.error(`[ERROR] ${message}`, enrichedAttributes);
        break;
      default:
        console.log(message, enrichedAttributes);
    }
  }
}
