import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { OtelErrorHandler } from './services/otelErrorHandler.service';
import "./../telemetry/otel-init";
import "./../telemetry/web-vitals-intrumentation"

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),
    { provide: ErrorHandler, useClass: OtelErrorHandler }
  ]
};
