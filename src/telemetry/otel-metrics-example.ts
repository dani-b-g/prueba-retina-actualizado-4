import { meter } from './otel-metrics';

export const clickCounter = meter.createCounter('button_clicks', {
  description: 'Contador de clicks en botones',
});

export const taskDuration = meter.createHistogram('task_duration', {
  description: 'Duración de tareas en ms',
});

// Al hacer click:
clickCounter.add(1, { button: 'submit' });

// Para medir duración:
const start = performance.now();
// ...tarea pesada
const end = performance.now();
taskDuration.record(end - start, { task: 'heavy-computation' });
