# Image Intelligence Platform

## 1. Resumen Ejecutivo (para reclutadores)

**Image Intelligence Platform** es una aplicación backend orientada al análisis automático de imágenes. Permite recibir imágenes desde un cliente, procesarlas de forma asíncrona y escalable, extraer información relevante (metadatos, colores dominantes, brillo, hash, etc.), almacenarlas de manera eficiente y exponer los resultados a través de una API.

El proyecto está diseñado con una **arquitectura moderna, desacoplada y escalable**, inspirada en sistemas reales de producción:

* Procesamiento asíncrono mediante colas
* Separación clara de responsabilidades
* Uso de almacenamiento de objetos para binarios
* Persistencia flexible para datos de análisis

Esta solución es ideal como base para sistemas de **Computer Vision**, **IA aplicada a imágenes**, **moderación de contenido**, **clasificación visual** o **análisis multimedia**.

---

## 2. Qué problema resuelve

Procesar imágenes de forma síncrona suele generar:

* APIs lentas
* alto consumo de memoria
* poca escalabilidad

Image Intelligence Platform resuelve esto mediante:

* procesamiento en segundo plano (workers)
* almacenamiento eficiente de imágenes
* persistencia flexible de resultados
* arquitectura preparada para crecer (IA, ML, búsquedas avanzadas)

---

## 3. Arquitectura General

La aplicación está construida como un **monorepo con Nx**, lo que permite compartir código y mantener una estructura clara.

### Componentes principales

1. **API (NestJS)**

   * Recibe imágenes
   * Publica jobs en una cola
   * Expone endpoints de consulta
   * No procesa imágenes

2. **Worker (NestJS + BullMQ)**

   * Consume jobs desde Redis
   * Descarga imágenes desde MinIO
   * Analiza imágenes
   * Guarda resultados en MongoDB

3. **Redis**

   * Coordinación de trabajos (BullMQ)

4. **MinIO**

   * Almacenamiento de imágenes (Object Storage)

5. **MongoDB**

   * Persistencia de resultados de análisis
   * Esquema flexible (documental)

---

## 4. Flujo de la aplicación

1. El cliente envía una imagen a la API
2. La API:

   * guarda la imagen en MinIO
   * envía un job a la cola (Redis)
3. El worker:

   * consume el job
   * descarga la imagen desde MinIO
   * analiza la imagen
   * guarda los resultados en MongoDB
4. La API expone endpoints para consultar:

   * lista de imágenes procesadas
   * metadatos y análisis
   * imagen original desde MinIO

Este flujo desacopla completamente la recepción de imágenes del procesamiento pesado.

---

## 5. Tecnologías utilizadas

### Backend

* **Node.js**
* **TypeScript (strict)**
* **NestJS** (API y Worker)
* **Nx Monorepo**

### Procesamiento asíncrono

* **BullMQ**
* **Redis**

### Almacenamiento

* **MinIO** (Object Storage compatible con S3)
* **MongoDB** (Base de datos documental)

### Infraestructura

* **Docker / Docker Compose**

---

## 6. Estructura del Monorepo

```
image-intelligence-v2/
├─ apps/
│  ├─ api/          # API REST
│  └─ worker/       # Procesamiento asíncrono
│
├─ packages/
│  ├─ shared/       # DTOs y tipos compartidos
│  ├─ queue/        # Configuración BullMQ
│  ├─ storage/     # Cliente MinIO
│  └─ image/        # Utilidades de análisis
│
├─ docker-compose.yml
└─ nx.json
```

---

## 7. Diseño de datos

### Imagen (MongoDB)

Cada imagen analizada se guarda como un documento flexible:

```json
{
  "filename": "1764558900283.png",
  "bucket": "images",
  "metadata": {
    "format": "png",
    "size": 874354,
    "width": 800,
    "height": 800,
    "aspectRatio": 1,
    "orientation": "square",
    "hasAlpha": false,
    "dominantColor": { "r": 8, "g": 8, "b": 8 }
  },
  "palette": [
    { "r": 8, "g": 8, "b": 8 },
    { "r": 120, "g": 110, "b": 100 }
  ],
  "brightness": "dark",
  "hash": "3a6e205d28c9...",
  "status": "processed",
  "createdAt": "2025-12-28T21:10:00Z"
}
```

Este diseño permite:

* agregar nuevos campos sin migraciones
* guardar resultados de IA futuros
* versionar análisis

---

## 8. Endpoints principales

### API

| Método | Endpoint         | Descripción                 |
| ------ | ---------------- | --------------------------- |
| POST   | /images/upload   | Sube imagen y crea job      |
| GET    | /images          | Lista imágenes analizadas   |
| GET    | /images/:id      | Detalle de análisis         |
| GET    | /images/:id/file | Imagen original desde MinIO |

---

## 9. Decisiones de arquitectura (importantes)

* ❌ No se envían imágenes por Redis
* ✅ Solo se pasan referencias (bucket + filename)
* ✅ Los workers son stateless
* ✅ Separación clara API / Worker
* ✅ MongoDB para flexibilidad
* ✅ MinIO para binarios

Estas decisiones hacen que el sistema sea:

* escalable
* mantenible
* fácil de extender

---

## 10. Estado actual del proyecto

Actualmente el sistema:

* recibe imágenes
* las almacena en MinIO
* las procesa de forma asíncrona
* extrae metadatos y colores
* guarda resultados en MongoDB
* expone endpoints de consulta

---

## 11. Próximos pasos (roadmap)

* Refactorización de módulos
* Versionado de análisis
* Estados de job más avanzados
* Integración con IA (clasificación, etiquetas)
* Búsqueda por similitud
* Dashboard frontend
* Autenticación

---

## 12. Conclusión

Image Intelligence Platform demuestra:

* dominio de arquitectura backend moderna
* uso correcto de colas y workers
* buenas prácticas en NestJS
* diseño orientado a escalabilidad

Es una base sólida para sistemas reales de análisis de imágenes y aplicaciones con IA.
