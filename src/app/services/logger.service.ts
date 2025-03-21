import { Injectable } from '@angular/core';
import { trace, context } from '@opentelemetry/api';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor() {}

  logWithTrace(message: string, ...optionalParams: any[]) {
    const span = trace.getSpan(context.active());
    if (span) {
      const { traceId, spanId } = span.spanContext();
      console.log(
        `[traceId: ${traceId}, spanId: ${spanId}] ${message}`,
        ...optionalParams
      );
    } else {
      console.log(message, ...optionalParams);
    }
  }
}
