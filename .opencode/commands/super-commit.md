# Commits JSON - Guía de Uso

1. Realiza: git add -A

## Estructura del Mensaje de Commit

Todos los commits deben seguir el formato JSON anidado según la estructura de la web modificada:

```json
{
  "commit": {
    "date": "YYYY-MM-DD",
    "type": "tipo_de_cambio",
    "summary": "Descripción breve del cambio principal",
    "webs": {
      "nombre_web": {
        "path": "ruta/a/los/archivos/",
        "changes": {
          "archivo_modificado.ext": [
            "Descripción del cambio 1",
            "Descripción del cambio 2"
          ]
        }
      }
    }
  }
}
```

## Tipos de Commit (`type`)

| Tipo | Descripción |
|------|-------------|
| `config` | Cambios en configuración (GTM, Meta Pixel, etc.) |
| `feature` | Nueva funcionalidad |
| `fix` | Corrección de errores |
| `refactor` | Reestructuración de código sin cambiar funcionalidad |
| `style` | Cambios de estilos CSS, colores, diseño |
| `docs` | Cambios en documentación |
| `content` | Actualización de contenido textual |
| `seo` | Optimizaciones SEO |

## Ejemplos

### Ejemplo 1: Una sola web, múltiples archivos

```json
{
  "commit": {
    "date": "2026-04-22",
    "type": "config",
    "summary": "Integrar Google Tag Manager y desactivar Meta Pixel en Sound Division",
    "webs": {
      "sounddivision": {
        "path": "sound/",
        "changes": {
          "index.html": [
            "Comentar Meta Pixel Code (PageView)",
            "Agregar Google Tag Manager (GTM-MPZZQR4C) en head",
            "Agregar GTM noscript en body"
          ],
          "sounddivision-thanks.html": [
            "Comentar Meta Pixel Code (Purchase)",
            "Agregar Google Tag Manager (GTM-MPZZQR4C) en head"
          ]
        }
      }
    }
  }
}
```

### Ejemplo 2: Múltiples webs

```json
{
  "commit": {
    "date": "2026-04-22",
    "type": "style",
    "summary": "Extraer colores hardcodeados a variables CSS en :root",
    "webs": {
      "sounddivision": {
        "path": "sound/styles/",
        "changes": {
          "style.css": [
            "Crear bloque :root con 6 variables de color",
            "Reemplazar hsla() hardcodeados por var()"
          ]
        }
      },
      "electricshadows": {
        "path": "styles/",
        "changes": {
          "style.css": [
            "Ajustar --accent-color de hsla(20,...) a hsla(190,...)"
          ]
        }
      }
    }
  }
}
```

### Ejemplo 3: Cambio simple en un archivo

```json
{
  "commit": {
    "date": "2026-04-22",
    "type": "fix",
    "summary": "Corregir espaciado en línea del body",
    "webs": {
      "electricshadows": {
        "path": "index.html",
        "changes": ["Corrección de espaciado en línea"]
      }
    }
  }
}
```

## Comando para ejecutar

```bash
git add -A && git commit -m 'JSON_AQUI' && git push
```

## Reglas

1. **Siempre usar JSON válido** - verificar comas, comillas y llaves
2. **Fecha en formato ISO** - `YYYY-MM-DD`
3. **Anidar por web** - cada web modificada es una propiedad en `webs`
4. **Anidar por archivo** - dentro de cada web, listar archivos modificados con sus cambios
5. **Resumen conciso** - máximo 80 caracteres
6. **Cambios en array** - cada cambio es un string descriptivo

# Pregunta si quiero hacer un git push