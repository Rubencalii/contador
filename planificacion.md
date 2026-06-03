# ChatStats — Qué es y cómo funciona

## La idea

ChatStats es una app web que coge un chat exportado de WhatsApp y lo convierte en
estadísticas del grupo: quién habla más, cuántas fotos/audios/stickers se mandan,
los emojis y palabras favoritos, gráficos de actividad y datos curiosos.

Lo importante: **todo se procesa en el propio navegador**. El archivo del chat
nunca se sube a ningún servidor, así que es 100% privado. No hay cuentas, ni
login, ni base de datos. Entras, sueltas el archivo y ves los resultados.

Público: gente normal (grupos de amigos, familia, pareja) que quiere cotillear
las estadísticas de su grupo.

---

## Cómo se usa (flujo)

1. El usuario exporta un chat desde WhatsApp:
   - "Sin archivos" → le da un `.txt`.
   - "Con archivos" → le da un `.zip` (con el chat y las fotos/audios dentro).
2. Arrastra ese `.txt` o `.zip` a la web (o hace clic para elegirlo).
3. La app lee el archivo, lo analiza al momento y muestra un panel con todas las
   estadísticas.
4. Puede explorar los datos, abrir el detalle de cada persona, ver un resumen
   tipo "Wrapped" y descargar las estadísticas como imagen para compartir.

No hace falta nada más: ni instalar, ni registrarse.

---

## Qué información saca

A partir del texto del chat, la app entiende cada mensaje: **quién** lo escribió,
**cuándo** y de **qué tipo** es (texto, imagen, vídeo, audio, sticker, GIF,
documento, contacto, ubicación o mensaje eliminado). Funciona con chats de Android
y de iPhone, en español e inglés, y detecta solo el formato de fecha del país.

Con eso calcula, entre otras cosas:

- **Totales del grupo:** nº de mensajes, de personas, de imágenes, vídeos, audios,
  stickers, GIFs, documentos, emojis, palabras y media de mensajes por día.
- **Por persona:** cuántos mensajes manda cada uno y su % del total, cuánta
  multimedia, cuántos emojis y palabras, mensajes más largos, y cuánto tarda de
  media en responder.
- **Actividad en el tiempo:** evolución por días/meses, a qué horas se habla más,
  qué días de la semana, y un mapa de calor de hora × día.
- **Emojis y palabras** más usados del grupo (ignorando palabras vacías como
  "de", "la", "que"…).
- **Datos curiosos y premios:** el más hablador, el fantasma (el que menos
  escribe), el fotógrafo, el locutor (audios), el búho nocturno, el madrugador,
  quién rompe el hielo más veces, el más rápido respondiendo, el que deja en
  visto, el día récord de mensajes, el mensaje más largo, etc.

---

## Partes de la app

### 1. Pantalla de inicio
Una zona para soltar/elegir el archivo `.txt` o `.zip`, con una breve explicación
de qué hace la app y un paso a paso de cómo exportar el chat desde WhatsApp.
Muestra avisos si el archivo no es válido o es demasiado grande.

### 2. Panel de resultados
Una vez analizado el chat, se muestra todo:
- Tarjetas con los números totales del grupo.
- Bloque de "datos curiosos" y de "medallas/premios" por persona.
- Ranking de participantes (quién habla más, con su porcentaje).
- Tabla detallada con todos los datos por persona, ordenable por cualquier columna.
- Gráficos de actividad (evolución temporal, por hora, por día, mapa de calor).
- Top de emojis y de palabras.
- Botón para descargar todo el resumen como una imagen.

### 3. Detalle de una persona
Al pulsar sobre alguien del ranking se abre su ficha: sus mensajes, su multimedia,
sus emojis y palabras top, su hora más activa y su tiempo de respuesta.

### 4. Modo "Wrapped"
Un resumen tipo *Spotify Wrapped*: una vista llamativa con los datos más
destacados del grupo, pensada para compartir.

---

## En una frase

> Una web privada (todo en tu navegador) que convierte el chat exportado de tu
> grupo de WhatsApp en un panel de estadísticas: quién habla más, multimedia,
> emojis, gráficos de actividad, premios divertidos y un resumen compartible.
