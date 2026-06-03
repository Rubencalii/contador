# 📊 WhatsApp Chat Analyzer (Contador)

¡Descubre las estadísticas más interesantes de tus grupos de WhatsApp! Este proyecto ofrece dos modalidades para analizar los chats exportados de WhatsApp: una **potente aplicación web interactiva** y un **script de consola en Python**.

![WhatsApp Analyzer Banner](https://img.shields.io/badge/Status-Activo-success)
![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC?logo=tailwind-css)
![Python](https://img.shields.io/badge/Python-3.x-yellow?logo=python)

---

## 🌟 Características

- 📈 **Métricas globales detalladas**: Conoce el total de mensajes, imágenes, audios, videos y stickers compartidos.
- 🏆 **Ranking de usuarios**: Descubre quién es el más hablador, quién manda más audios o comparte más memes.
- 📅 **Actividad temporal**: Gráficos de barra y líneas para ver los días y horas con más actividad en el chat.
- 😃 **Análisis de Emojis y Palabras**: Ranking de los emojis y palabras más utilizadas por cada participante.
- 🌓 **Modo Claro/Oscuro**: Adaptable a las preferencias de tu sistema de forma automática.
- 🔒 **Totalmente privado**: Todo el procesamiento se realiza localmente (ya sea en tu navegador web o en tu máquina usando Python). ¡Tus mensajes nunca van a un servidor de terceros!

---

## 🚀 Empezando

### 1. Exporta tu chat de WhatsApp
Para acceder a las métricas primero necesitas exportar la conversación:

1. Abre WhatsApp (en tu teléfono).
2. Entra al chat que deseas analizar.
3. Toca los tres puntos (Menú) > **Más** > **Exportar chat**.
4. Selecciona **"Sin archivos"** para agilizar el proceso y generar un archivo `.txt` o un `.zip`.
5. Guárdalo o envíatelo a tu propio dispositivo/ordenador.

### 2. Forma de Uso A: Aplicación Web Interactiva 🌐

La forma más amigable y visual de ver las estadísticas de tu chat. 

**Requisitos**: Node.js instalado.

```bash
# 1. Entra a la carpeta web
cd web

# 2. Instala las dependencias
npm install

# 3. Arranca el servidor de desarrollo
npm run dev
```

Se abrirá un servidor local (normalmente en `http://localhost:5173` o `5174`). Tan solo tendrás que **arrastrar y soltar** el archivo `.txt` o `.zip` generado por WhatsApp en la aplicación web para empezar a disfrutar del resumen.

### 2. Forma de Uso B: Script Python en Consola 🐍

Ideal si prefieres manejar datos rápidos directo en consola o quieres integrarlo en otros flujos.

**Requisitos**: Python 3+.

```bash
# Simplemente ejecuta de esta forma y te analizará los grupos:
python contador.py "ruta/al/chat_de_WhatsApp.txt"
```
*(Si dejas el `.txt` en la misma raíz, el script lo detectará automáticamente).*

---

## 📂 Estructura del Proyecto

```text
📁 Proyecto
├── 📄 contador.py      -> Analizador CLI escrito en Python.
└── 📁 web/             -> App Frontend interactiva con interfaz de usuario.
    ├── 📄 package.json -> Dependencias (React, Vite, Tailwind v4, Recharts, JSZip).
    ├── 📄 vite.config.js
    └── 📁 src/         -> Componentes, parseadores y el dashboard principal.
```

---

## 🛠️ Tecnologías y Librerías Utilizadas

- **Frontend:**
  - React 19 + Vite 8
  - Tailwind CSS v4 para diseño moderno y adaptativo
  - Recharts para los gráficos interactivos
  - JSZip para abrir archivos exportados comprimidos en el mismísimo cliente
  - HTML-to-Image para capturar resúmenes del dashboard (posible funcionalidad compartible).
- **Backend/Scripting:** Python puro, usando herramientas estándar (`re`, `collections`).

---

## 💡 Notas de Privacidad
> **Tu privacidad está a salvo:** Al usar la aplicación web o el script Python local, ninguna información del chat se sube a internet. Todo el proceso de parseo, conteo y renderizado de gráficas ocurre dentro de la memoria de tu dispositivo.

## 🤝 Contribuir
¡Siéntete libre de añadir nuevas métricas y abrir *pull requests*! Ciertas frases, marcadores de multimedia o formatos de fecha en WhatsApp pueden diferir dependiendo del sistema operativo (Android/iOS) y del idioma; aportaciones para dar el mejor soporte internacional son más que bienvenidas.