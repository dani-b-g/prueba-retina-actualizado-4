import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { trace, context, Span } from '@opentelemetry/api';

@Injectable()
export class OtelErrorHandler implements ErrorHandler {
  private tracer = trace.getTracer('angular-error-handler');

  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const parentSpan = this.tracer.startSpan('error', {
      attributes: {
        'error.message': error.message || error.toString(),
        'error.stack': error.stack || '',
      },
    });

    parentSpan.recordException(error);
    parentSpan.setStatus({ code: 2, message: error.message }); // 2 = ERROR
    parentSpan.end();

    // OPCIONAL: Log con traceId/spanId
    const spanContext = parentSpan.spanContext();
    console.error(`[Error] traceId=${spanContext.traceId} spanId=${spanContext.spanId}`, error);

    // Puedes dejar que Angular también maneje el error por defecto:
    throw error;
  }
}
