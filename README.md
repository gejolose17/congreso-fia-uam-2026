# Congreso FIA UAM 2026 · Sistema de Registro y Dashboard en Tiempo Real

Aplicación web moderna para el registro simultáneo de hasta **400+ asistentes** en el Congreso de Ingeniería y Arquitectura (FIA) de la **Universidad Americana (UAM), Nicaragua**, con sincronización segura hacia **Google Sheets (4 hojas)** y **Dashboard en Tiempo Real**.

## Arquitectura Cero-Pérdida para Alta Concurrencia

Google Sheets limita la API a ~60 escrituras por minuto. Para evitar bloqueos o pérdida de datos cuando 400 asistentes se registran al mismo tiempo:

1. **Lectura y Escritura Instantánea (`< 50 ms`)**: Las consultas de CIF, lista de empresas y registros se atienden sobre una base rápida (**Supabase PostgreSQL** en producción gratuita, o **SQLite WAL nativo** en modo local sin configuración).
2. **Cola de Sincronización en Lotes**: Los *checks* de estudiantes (`batchUpdate`) y las filas de patrocinadores, docentes e invitados (`append`) se agrupan y envían a Google Sheets respetando las cuotas de la API.
3. **Privacidad**: Los asistentes nunca ven ni acceden al Google Sheet. El dashboard (`/admin/dashboard`) está protegido con PIN (`ADMIN_PIN`).

## Las 4 Hojas del Google Sheet

- **`1_Estudiantes`**: `CIF` | `Nombre Completo` | `Carrera` | `Check` | `Fecha/Hora Registro`
- **`2_Patrocinadores`**: `Empresa` | `Nombre` | `Apellido` | `Fecha/Hora Registro` *(+ Columna `F`: `Lista_Empresas` con las 23 empresas)*
- **`3_Docentes`**: `Nombre` | `Apellido` | `Carrera` (`Ingeniería Industrial`, `Ingeniería Civil`, `Arquitectura`) | `Fecha/Hora Registro`
- **`4_Invitados`**: `Nombre` | `Apellido` | `Fecha/Hora Registro`

## Rutas Principales

- `/` — Portal principal con los 4 botones y visor de Códigos QR
- `/registro/estudiantes` — Validación de CIF y bloqueo contra doble registro
- `/registro/patrocinadores` — Selector de las 23 empresas + nombre y apellido
- `/registro/docentes` — Nombre, apellido y las 3 carreras FIA
- `/registro/invitados` — Nombre y apellido
- `/admin/login` — Acceso administrativo (PIN por defecto: `2026`)
- `/admin/dashboard` — Dashboard en tiempo real (SSE) + respaldo CSV
- `/admin/qr` — Centro de códigos QR descargables e imprimibles
- `/admin/google-setup` — Configuración OAuth (`/api/auth/google`), creación automática de Sheet y Puente Apps Script

## Uso Local Inmediato

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Ya incluye 10 CIFs de prueba (`20210001` al `20240010`) y 23 empresas de prueba cargadas automáticamente.

## Despliegue Cero Costo en Producción (Vercel + Supabase)

1. Crea un proyecto gratuito en **Supabase** y ejecuta el contenido de `supabase_schema.sql` en el *SQL Editor*.
2. Despliega este repositorio en **Vercel** (plan Hobby gratuito) con las variables de `.env.example`.
3. Entra a `/admin/google-setup` para conectar tu cuenta Google (`/api/auth/google`) o pegar tu Web App URL de Google Apps Script y presiona **Importar Estudiantes y Empresas**.

