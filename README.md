# Gemini Backend

API de práctica en TypeScript y NestJS para conectar una aplicación a Google Gemini. Incluye respuestas de texto, respuestas en streaming y un flujo de chat identificado por sesión. El cliente móvil de referencia es [Gemini App](https://github.com/EddyRuLop/gemini_app).

## Ejecutar localmente

1. Instala las dependencias con `npm ci`.
2. Copia `.env.template` a `.env` y coloca tu clave en `GEMINI_API_KEY`.
3. Ejecuta `npm run start:dev`.

La API escucha en el puerto 3000 por defecto. Puedes configurar otro con la variable `PORT`. Mantén `.env` fuera del repositorio.

| Método y ruta | Uso |
| --- | --- |
| `POST /api/gemini/basic-prompt` | Enviar un prompt y recibir la respuesta completa |
| `POST /api/gemini/basic-prompt-stream` | Recibir una respuesta progresiva |
| `POST /api/gemini/chat-stream` | Continuar un chat mediante su identificador |

Consulta los [controladores y DTO](src/gemini) para ver los formatos de las solicitudes. Compila con `npm run build`. Ejecuta el resultado con `npm run start:prod`.
