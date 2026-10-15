# Generador de imágenes de interacción — Heraldo Media Group

Versión con **acceso protegido del lado del servidor**. La contraseña no está
en el código: vive en la variable de entorno `APP_PASSWORD` de Vercel.

## Estructura

    app/index.html     el generador (NO está en /public, por eso Vercel no lo publica solo)
    api/app.js         pide la contraseña y, si es correcta, entrega el HTML
    api/_auth.js       verificación de la contraseña
    api/expand.js      extensión de foto con IA (hoy sin botón en la interfaz)
    vercel.json        rutea todo a api/app

## Variables de entorno en Vercel

| Nombre         | Valor                        | Obligatoria |
|----------------|------------------------------|-------------|
| `APP_PASSWORD` | la contraseña del equipo     | sí          |
| `APP_USER`     | usuario (default: `heraldo`) | no          |
| `GEMINI_API_KEY` | solo si se reactiva la IA  | no          |

Después de cambiar cualquier variable hay que hacer **Redeploy**: las variables
no se aplican a despliegues que ya existen.

## Para cambiar la contraseña

Settings -> Environment Variables -> editar `APP_PASSWORD` -> Redeploy.
No hay que tocar el código ni volver a subir archivos.

## Marcas activas

Vivas: Quintana Roo, Oaxaca, Edomex, Yucatán (estatales) y Monterrey,
Guadalajara, Tepic (radio). El Heraldo de México y las seis verticales de
"Otras" están en estado `soon`: aparecen en gris y no generan.
