# -*- coding: utf-8 -*-
"""
Contador de mensajes de un grupo de WhatsApp.

Cuenta, por persona y en total:
  - Mensajes de texto
  - Imagenes
  - Videos
  - Audios (notas de voz)
  - Stickers
  - GIFs
  - Documentos
  - Emojis / emoticonos

USO:
  1. Exporta el chat desde WhatsApp ("Exportar chat" -> "Sin archivos") -> guarda el .txt
  2. Pon el .txt en esta misma carpeta (o pasa la ruta como argumento).
  3. Ejecuta:  python contador.py
        o      python contador.py "ruta/al/chat.txt"
"""

import sys
import os
import re
import glob
from collections import defaultdict

# ---------------------------------------------------------------------------
# 1) Detectar el inicio de un mensaje (Android e iOS, en espanol)
# ---------------------------------------------------------------------------
# Android:  25/12/23, 14:30 - Nombre: mensaje
# iOS:      [25/12/23, 14:30:45] Nombre: mensaje
PATRON_ANDROID = re.compile(
    r'^(\d{1,2}/\d{1,2}/\d{2,4}),?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:[ap]\.?\s?m\.?)?\s*-\s*([^:]+):\s?(.*)$',
    re.IGNORECASE,
)
PATRON_IOS = re.compile(
    r'^\[(\d{1,2}/\d{1,2}/\d{2,4}),?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:[ap]\.?\s?m\.?)?\]\s*([^:]+):\s?(.*)$',
    re.IGNORECASE,
)

# ---------------------------------------------------------------------------
# 2) Marcadores de multimedia (varian segun version/idioma del telefono)
# ---------------------------------------------------------------------------
MARCADORES = {
    'imagenes':   ['imagen omitida', 'image omitted', '‎imagen omitida'],
    'videos':     ['video omitido', 'vídeo omitido', 'video omitted'],
    'audios':     ['audio omitido', 'audio omitted', 'ptt omitido'],
    'stickers':   ['sticker omitido', 'sticker omitted'],
    'gifs':       ['gif omitido', 'gif omitted'],
    'documentos': ['documento omitido', 'document omitted'],
    'contactos':  ['contacto omitido', 'contact card omitted', 'tarjeta de contacto omitida'],
}
# Marcador generico de Android cuando exportas sin archivos
MULTIMEDIA_GENERICO = ['<multimedia omitido>', '<media omitted>']

# ---------------------------------------------------------------------------
# 3) Detectar emojis
# ---------------------------------------------------------------------------
PATRON_EMOJI = re.compile(
    "["
    "\U0001F300-\U0001FAFF"   # simbolos y pictogramas
    "\U00002700-\U000027BF"   # dingbats
    "\U00002600-\U000026FF"   # simbolos misc
    "\U0001F1E6-\U0001F1FF"   # banderas
    "\U00002B00-\U00002BFF"   # flechas y simbolos
    "\U0000FE00-\U0000FE0F"   # variation selectors
    "\U0001F000-\U0001F0FF"   # fichas/cartas
    "]+",
    flags=re.UNICODE,
)


def linea_es_inicio(linea):
    """Devuelve (autor, texto) si la linea empieza un mensaje; si no, None."""
    m = PATRON_ANDROID.match(linea) or PATRON_IOS.match(linea)
    if m:
        return m.group(2).strip(), m.group(3)
    return None


def clasificar(texto):
    """Devuelve la categoria multimedia del texto, o None si es texto normal."""
    t = texto.lower().strip().lstrip('‎').strip()
    for categoria, marcas in MARCADORES.items():
        for marca in marcas:
            if marca in t:
                return categoria
    for marca in MULTIMEDIA_GENERICO:
        if marca in t:
            return 'multimedia'  # no se puede saber el tipo exacto
    return None


def contar(ruta):
    # contadores[autor][categoria] = numero
    contadores = defaultdict(lambda: defaultdict(int))

    autor_actual = None
    with open(ruta, 'r', encoding='utf-8') as f:
        for linea in f:
            linea = linea.rstrip('\n')
            inicio = linea_es_inicio(linea)

            if inicio:
                autor, texto = inicio
                autor_actual = autor
                # Ignorar mensajes de sistema (sin autor real suelen no tener ':')
                categoria = clasificar(texto)
                if categoria:
                    contadores[autor][categoria] += 1
                else:
                    contadores[autor]['mensajes'] += 1
                    emojis = sum(len(e) for e in PATRON_EMOJI.findall(texto))
                    contadores[autor]['emojis'] += emojis
            else:
                # Linea de continuacion del mensaje anterior (mensaje multilinea)
                if autor_actual is not None and linea.strip():
                    emojis = sum(len(e) for e in PATRON_EMOJI.findall(linea))
                    contadores[autor_actual]['emojis'] += emojis

    return contadores


CATEGORIAS = ['mensajes', 'imagenes', 'videos', 'audios', 'stickers',
              'gifs', 'documentos', 'contactos', 'multimedia', 'emojis']

ETIQUETAS = {
    'mensajes': 'Mensajes',
    'imagenes': 'Imagenes',
    'videos': 'Videos',
    'audios': 'Audios',
    'stickers': 'Stickers',
    'gifs': 'GIFs',
    'documentos': 'Documentos',
    'contactos': 'Contactos',
    'multimedia': 'Multimedia (sin clasificar)',
    'emojis': 'Emojis',
}


def imprimir_resultados(contadores):
    if not contadores:
        print("No se encontro ningun mensaje. Revisa que el archivo sea un export de WhatsApp.")
        return

    # Totales del grupo
    totales = defaultdict(int)
    for autor, datos in contadores.items():
        for cat, n in datos.items():
            totales[cat] += n

    print("\n" + "=" * 50)
    print("           TOTALES DEL GRUPO")
    print("=" * 50)
    for cat in CATEGORIAS:
        if totales[cat]:
            print(f"  {ETIQUETAS[cat]:<28} {totales[cat]:>8}")

    # Ranking por persona (ordenado por mensajes)
    print("\n" + "=" * 50)
    print("           DESGLOSE POR PERSONA")
    print("=" * 50)
    orden = sorted(contadores.items(),
                   key=lambda x: x[1].get('mensajes', 0), reverse=True)
    for i, (autor, datos) in enumerate(orden, 1):
        print(f"\n  {i}. {autor}")
        for cat in CATEGORIAS:
            if datos.get(cat):
                print(f"       {ETIQUETAS[cat]:<26} {datos[cat]:>8}")


def main():
    if len(sys.argv) > 1:
        ruta = sys.argv[1]
    else:
        # Buscar automaticamente un .txt en la carpeta del script
        carpeta = os.path.dirname(os.path.abspath(__file__))
        txts = glob.glob(os.path.join(carpeta, '*.txt'))
        if not txts:
            print("No encontre ningun archivo .txt en esta carpeta.")
            print("Exporta el chat de WhatsApp y pon el .txt aqui, o ejecuta:")
            print('   python contador.py "ruta/al/chat.txt"')
            return
        ruta = txts[0]
        print(f"Usando archivo: {os.path.basename(ruta)}")

    if not os.path.isfile(ruta):
        print(f"No existe el archivo: {ruta}")
        return

    contadores = contar(ruta)
    imprimir_resultados(contadores)


if __name__ == '__main__':
    main()
