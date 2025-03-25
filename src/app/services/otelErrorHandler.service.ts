import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class OtelErrorHandler implements ErrorHandler {
  private tracer = trace.getTracer('angular-error-handler');

  constructor(private injector: Injector, private loggerService:LoggerService) {}

  handleError(error: any): void {
    // Maneja errores globales no atrapados
    this.createErrorSpan('Unhandled Error', error);
  }

  // Método reutilizable para errores personalizados desde cualquier componente o servicio
  reportCustomError(
    name: string,
    message: string,
    additionalAttributes: Record<string, any> = {}
  ): void {
    const error = new Error(message);
    this.createErrorSpan(name, error, additionalAttributes);
  }

  // Método común para crear un span de error
  private createErrorSpan(
    name: string,
    error: Error,
    extraAttributes: Record<string, any> = {}
  ): void {
    const parentContext = context.active(); // intenta capturar contexto actual
    const parentSpan = trace.getSpan(parentContext);

    const span = this.tracer.startSpan(
      name,
      {
        attributes: {
          'error.name': error.name || 'UnknownError',
          'error.message': error.message || 'No message',
          'error.stack': error.stack || 'No stack trace',
          ...extraAttributes,
        },
      },
      parentContext // vincula al span activo si existe
    );
    
    this.loggerService.logError('Error capturado en ErrorHandler', { error: error.message||'undefined'});
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    span.end();

    const spanContext = span.spanContext();
    console.error(
      `[Error] traceId=${spanContext.traceId} spanId=${spanContext.spanId}`,
      error
    );
  }
}
