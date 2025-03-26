# ✨ Observabilidad con Grafana, Prometheus, Loki, Tempo y Elasticsearch + Kibana

Este entorno Docker te permite tener un stack completo de observabilidad para aplicaciones frontend (como Angular), con trazas, logs, métricas y opcionalmente Elasticsearch/Kibana como visor adicional.

---

## 🤖 Servicios Incluidos

| Servicio         | Puerto | Descripción                                                                 |
|------------------|--------|-----------------------------------------------------------------------------|
| Grafana          | `3000` | Visualización de métricas, logs y trazas. Datasources: Prometheus, Loki, Tempo. |
| Prometheus       | `9090` | Recolección de métricas desde el OTEL Collector.                            |
| Loki             | `3100` | Recolección de logs desde OTEL Collector (OTLP).                            |
| Tempo            | `3200` | Recolección y almacenamiento de trazas desde OTEL Collector.                |
| OTEL Collector   | `4318` | Punto de ingesta OTLP (HTTP) para logs, métricas y trazas.                   |
| Elasticsearch    | `9200` | Almacenamiento de datos estructurados (opcional).                            |
| Kibana           | `5601` | Exploración de datos en Elasticsearch (opcional).                            |

---

## 🚀 Iniciar el entorno en local

```bash
# Clonar el proyecto (si aplica)
git clone <repo-url>
cd <directorio>

# Iniciar los contenedores
docker-compose down
docker-compose up -d
```

Verifica en el navegador:

- Grafana: [http://localhost:3000](http://localhost:3000)
- Prometheus: [http://localhost:9090](http://localhost:9090)
- Tempo: [http://localhost:3200](http://localhost:3200)
- Loki: [http://localhost:3100](http://localhost:3100)
- Elasticsearch: [http://localhost:9200](http://localhost:9200)
- Kibana: [http://localhost:5601](http://localhost:5601)

---

## 🌍 Flujo de datos (Mermaid)

graph TD
  A[App Angular] -->|OTLP HTTP (4318)| B(OpenTelemetry Collector)

  subgraph Collector Pipelines
    B --> C1[Exporta Métricas ➔ Prometheus]
    B --> C2[Exporta Logs ➔ Loki]
    B --> C3[Exporta Trazas ➔ Tempo]
  end

  C1 --> D[Grafana]
  C2 --> D
  C3 --> D

  subgraph Opcional
    B --> E[Elasticsearch]
    E --> F[Kibana]
  end

---

## 📃 Archivos importantes

- `docker-compose.yml`: define todos los servicios.
- `otel-collector-config.yml`: configura los pipelines del OTEL Collector.
- `prometheus.yml`: configuración de scrape para Prometheus.
- `tempo.yml`, `loki.yml`, `dashboards.yml`: provisioning para Grafana.

---

## 🔧 Enviar datos desde Angular

En tu app Angular puedes usar `@opentelemetry/sdk-trace-web` y `@opentelemetry/exporter-trace-otlp-http` para enviar trazas. Asegúrate de apuntar al endpoint:

```
http://localhost:4318/v1/traces
```

Logs y métricas pueden ser enviados desde el backend o con wrappers personalizados.

---

## 🔐 Accesos por defecto

- **Grafana**: `admin` / `admin`
- **Kibana**: No requiere login (seguridad desactivada)

---

## 📅 Próximos pasos sugeridos

- Agregar Filebeat para enviar logs desde archivos a Elasticsearch.
- Añadir Elastic APM Server para trazas frontend.
- Crear dashboards personalizados en Kibana.

---

Cualquier duda o extensión adicional (como alertas, APM, beats o Web Vitals), ¡no dudes en preguntar!

