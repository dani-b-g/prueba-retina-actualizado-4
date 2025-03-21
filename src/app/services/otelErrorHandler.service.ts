import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { trace, context } from '@opentelemetry/api';

@Injectable({ providedIn: 'root' })
export class OtelErrorHandler implements ErrorHandler {
  private tracer = trace.getTracer('angular-error-handler');

  constructor(private injector: Injector) {}

  handleError(error: any): void {
    this.createErrorSpan('Unhandled Error', error);
    throw error;
  }

  // NUEVO MÉTODO para errores personalizados
  reportCustomError(name: string, message: string, additionalAttributes: Record<string, any> = {}) {
    const error = new Error(message);
    this.createErrorSpan(name, error, additionalAttributes);
  }

  private createErrorSpan(name: string, error: Error, extraAttributes: Record<string, any> = {}) {
    const span = this.tracer.startSpan(name, {
      attributes: {
        'error.message': error.message,
        'error.stack': error.stack || '',
        ...extraAttributes,
      },
    });

    span.recordException(error);
    span.setStatus({ code: 2, message: error.message });
    span.end();

    const spanContext = span.spanContext();
    console.error(`[Custom Error] traceId=${spanContext.traceId} spanId=${spanContext.spanId}`, error);
  }
}
