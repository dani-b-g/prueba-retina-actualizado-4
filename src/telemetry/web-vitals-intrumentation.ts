import { onCLS, onLCP, onINP } from 'web-vitals';
import { trace, context, Span } from '@opentelemetry/api';
import { hrTime } from '@opentelemetry/core';

class WebVitalsInstrumentation {
  private readonly tracer = trace.getTracer('web-vitals-instrumentation');

  constructor() {
    this.init();
  }

  private init() {
    const parentSpan = this.tracer.startSpan('web-vitals');
    const ctx = trace.setSpan(context.active(), parentSpan);
    parentSpan.end();

    const reportMetric = (metric: any) => {
      const now = hrTime();
      const span: Span = this.tracer.startSpan(metric.name, { startTime: now }, ctx);
      span.setAttributes({
        'web_vital.name': metric.name,
        'web_vital.id': metric.id,
        'web_vital.navigationType': metric.navigationType,
        'web_vital.delta': metric.delta,
        'web_vital.rating': metric.rating,
        'web_vital.value': metric.value,
        'web_vital.entries': JSON.stringify(metric.entries),
      });
      span.end();
    };

    onCLS(reportMetric);
    onLCP(reportMetric);
    onINP(reportMetric);
  }
}

// Inicializa la instrumentación de Web Vitals
new WebVitalsInstrumentation();
