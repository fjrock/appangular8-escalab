# Appangular (Escalab Pub)

Aplicacion Angular para exploracion de cocteles con autenticacion Firebase.

## Stack actual

- Angular CLI `16.2.16`
- Angular `16.2.12`
- Angular Material `16.2.14`
- AngularFire `7.6.1` (compat)
- Firebase `10.12.5`
- Node recomendado: `20.x`

## Instalacion

```bash
npm install
```

## Desarrollo local

```bash
npm start
```

Por defecto abre en `http://localhost:4200`.
Si el puerto esta ocupado:

```bash
npm start -- --port 4201
```

## Build

```bash
npm run build
```

Salida en `dist/`.

## Funcionalidades principales

- Busqueda de cocteles por:
  - letra
  - nombre (con autocompletado)
  - ingrediente (con autocompletado)
  - categoria
  - tipo de alcohol
  - tipo de vaso
- Slider de resultados controlado por Angular (sin autoplay forzado).
- Vista responsive y estilo UI modernizado.
- Loader global durante navegacion y llamadas HTTP.
- Login con Firebase Auth y manejo amigable de errores comunes.

## Deploy en Vercel

1. Configurar version de Node en Vercel a `20.x` (o dejar que tome `engines` de `package.json`).
2. Ejecutar deploy.
3. En SPA, asegurar rewrite de rutas si se requiere (segun configuracion del hosting).

## Seguridad (Firebase API Key)

Si recibes alertas de Google Cloud sobre clave expuesta:

1. Rotar la API key.
2. Restringirla por `HTTP referrers` (dominios de produccion y localhost).
3. Limitar APIs permitidas a las necesarias para Firebase Web.

## Scripts disponibles

- `npm start`: levanta servidor de desarrollo.
- `npm run build`: build de produccion.
- `npm test`: pruebas unitarias.
- `npm run lint`: lint del proyecto.

