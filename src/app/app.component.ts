import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { clickCounter, taskDuration } from "../telemetry/otel-metrics-example";
import { OtelErrorHandler } from './services/otelErrorHandler.service';
import { LoggerService } from './services/logger.service';
import { DataService } from './services/data.service';
import { PokemonComponent } from "./components/pokemon/pokemon.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PokemonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'prueba-retina-actualizado-4';
  data:any={};
  error:any;
  otelErrorHandler=inject(OtelErrorHandler)
  logger=inject(LoggerService)
  dataService=inject(DataService)

  onClick() {
    clickCounter.add(1, { button: 'example' });
    const start = performance.now();
    this.dataService.getData().subscribe({
      next: (response: any) => {
        this.data = response;
        this.logger.logInfo(`Datos recuperados de DataService`, { action: 'Datos impresos' });
        const end = performance.now();
        taskDuration.record(end - start, { task: 'button-task' });
      },
      error: (err: any) => {
        console.error('Error al obtener los datos:', err);
        this.error = err;
        const end = performance.now();
        taskDuration.record(end - start, { task: 'button-task' });
      }
    });
  }
    

  someFunction() {
    // Reportar un error personalizado:
    this.otelErrorHandler.reportCustomError(
      'BusinessRuleViolation',
      'El usuario no tiene permisos para esta operación',
      { module: 'UserModule', severity: 'warning' }
    );
  }
  
  doActionLog() {
    // Log INFO para registrar acción de usuario
    this.logger.logInfo('Usuario hizo click en botón', { action: 'doAction' });

    // Log WARNING para advertencia (ejemplo de validación)
    const condition = false; // Simula una validación fallida
    if (!condition) {
      this.logger.logWarn('Validación fallida: condición no cumplida', { validation: 'conditionCheck' });
    }

    // Log ERROR para error simulado
    try {
      throw new Error('Error simulado en doAction');
    } catch (err:any) {
      this.logger.logError('Error capturado en doAction', { error: err.message||'undefined', action: 'doAction' });
    }
  }
}
