# Generador de Copy · Imágenes de Interacción
**El Heraldo de México · Equipo de Diseño Gráfico**

App web para generar propuestas de encabezado y sumario para imágenes de interacción en redes sociales, basada en el manual editorial de julio 2026.

---

## Cómo desplegarlo en Vercel (15 minutos, gratis)

### Paso 1 — Subir a GitHub
1. Ve a [github.com](https://github.com) y crea una cuenta si no tienes.
2. Crea un repositorio nuevo, llámalo `heraldo-copy-generator`.
3. Sube todos los archivos de esta carpeta al repositorio.

### Paso 2 — Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com) y entra con tu cuenta de GitHub.
2. Haz clic en **"Add New Project"**.
3. Selecciona el repositorio `heraldo-copy-generator`.
4. Haz clic en **Deploy** — Vercel detecta la configuración automáticamente.

### Paso 3 — Agregar la API key de Anthropic
1. En el dashboard de Vercel, ve a tu proyecto → **Settings → Environment Variables**.
2. Agrega una variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** tu API key de Anthropic (empieza con `sk-ant-...`)
3. Haz clic en **Save**.
4. Ve a **Deployments** y haz clic en **Redeploy** para que tome efecto.

### Paso 4 — Cambiar la contraseña (recomendado)
Abre `public/index.html` y busca esta línea:
```
const PASSWORD = 'heraldo2026';
```
Cámbiala por la contraseña que quieras y haz commit al repositorio. Vercel despliega automáticamente.

### Paso 5 — Compartir
Tu app quedará en una URL como:
```
https://heraldo-copy-generator.vercel.app
```
Comparte esa URL con el equipo. Cualquiera con la contraseña puede usarla desde el celular o la computadora.

---

## Estructura del proyecto

```
heraldo-copy-app/
├── public/
│   └── index.html       ← La app completa (pantalla de login + generador)
├── api/
│   └── generate.js      ← Función serverless que llama a la API de Anthropic
├── vercel.json          ← Configuración de rutas
├── package.json
└── README.md
```

---

## Cómo usar la app

1. Abre la URL en el navegador (funciona en celular y computadora).
2. Ingresa la contraseña del equipo.
3. Pega la liga de la nota del Heraldo.
4. Opcionalmente agrega la sección o una nota extra.
5. Toca **"Generar propuestas"**.
6. Selecciona la propuesta que más guste (el texto es editable).
7. Toca **"Aprobar y copiar"** → el copy queda en el portapapeles listo para mandarle al diseñador.

---

## Preguntas frecuentes

**¿Cuánto cuesta?**
Vercel es gratis para este uso. La API de Anthropic cobra por uso (~$0.003 por propuesta generada). Para 50 usos diarios el costo es menor a $5 USD/mes.

**¿Qué pasa si la IA no puede leer la nota?**
Si la URL no es accesible directamente, la IA infiere el tema desde el slug de la URL y genera propuestas aproximadas. El editor puede ajustar el texto antes de aprobar.

**¿Se puede cambiar la contraseña?**
Sí, editando la línea `const PASSWORD = '...'` en `public/index.html`.

**¿Quién mantiene esto?**
Equipo de Diseño Gráfico · Coordinación Creativa · El Heraldo de México.
