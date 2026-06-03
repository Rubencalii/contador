# 💬 ChatStats — Estadísticas de grupos de WhatsApp

Aplicación web que analiza un chat exportado de WhatsApp y muestra estadísticas
bonitas: mensajes por persona, fotos, audios, stickers, emojis, gráficos de
actividad y datos curiosos.

> 🔒 **100% privado.** Todo se procesa en el navegador con JavaScript. El
> archivo del chat **nunca se sube a ningún servidor**.

## ✨ Qué muestra

- **Totales del grupo**: mensajes, personas, imágenes, vídeos, audios, stickers,
  GIFs, documentos, emojis, palabras y media diaria.
- **Ranking de participantes** con barras y desglose por tipo.
- **Gráficos de actividad**: evolución en el tiempo, por hora del día y por día
  de la semana.
- **Top de emojis y palabras** más usados.
- **Datos curiosos**: el más hablador, búho nocturno, madrugador, quién rompe el
  hielo, día récord, etc.
- **Descargar el resumen como imagen** para compartirlo en el grupo.
- **Modo claro / oscuro**.

## 🚀 Cómo ejecutarlo

```bash
npm install      # instala dependencias (solo la primera vez)
npm run dev      # arranca en modo desarrollo -> http://localhost:5173
```

Para generar la versión final (carpeta `dist/`):

```bash
npm run build
npm run preview  # previsualizar la build
```

## 📱 Cómo conseguir el archivo del chat

1. Abre el grupo en WhatsApp.
2. Menú (⋮) o nombre del grupo → **Exportar chat**.
3. Elige **Sin archivos** (más rápido) o **Con archivos** (distingue mejor los
   tipos de multimedia).
4. Guarda el `.txt` y arrástralo a la web.

> En la carpeta `public/` tienes `ejemplo_chat.txt` para probar la app.

## 🛠️ Tecnologías

- [React](https://react.dev) + [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Recharts](https://recharts.org) (gráficos)
- [html-to-image](https://github.com/bubkoo/html-to-image) (descargar imagen)

## ☁️ Desplegar gratis (opcional)

Al ser una web estática, puedes subirla gratis a **Vercel**, **Netlify** o
**GitHub Pages**. Solo necesitas hacer `npm run build` y subir la carpeta `dist/`,
o conectar el repositorio.
