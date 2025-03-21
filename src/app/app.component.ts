import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { clickCounter, taskDuration } from "../telemetry/otel-metrics-example";
import { OtelErrorHandler } from './services/otelErrorHandler.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'prueba-retina-actualizado-4';
  otelErrorHandler=inject(OtelErrorHandler)

  onClick() {
    clickCounter.add(1, { button: 'example' });
    const start = performance.now();
    // ...algún proceso
    const end = performance.now();
    taskDuration.record(end - start, { task: 'button-task' });
  }
  someFunction() {
    // Reportar un error personalizado:
    this.otelErrorHandler.reportCustomError(
      'BusinessRuleViolation',
      'El usuario no tiene permisos para esta operación',
      { module: 'UserModule', severity: 'warning' }
    );
  }
}
